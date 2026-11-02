import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import { useLanguage } from '../../contexts/LanguageContext'
import { normalizePhone, phonePattern } from '../../lib/phone'

const fields = [
  { name: 'schoolName', label: 'schoolName', type: 'text', autoComplete: 'organization' },
  { name: 'contractManagerName', label: 'supervisorName', type: 'text', autoComplete: 'name' },
  { name: 'phoneNumber', label: 'phoneNumber', type: 'tel', autoComplete: 'tel', dir: 'ltr' },
  { name: 'email', label: 'email', type: 'email', autoComplete: 'email', dir: 'ltr' },
]

export default function RecordDialog({ mode, school, onClose, onSave, onDelete, onEdit }) {
  const { t, language } = useLanguage()
  const dialog = useRef(null)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const formik = useFormik({
    initialValues: Object.fromEntries(fields.map(({ name }) => [name, school?.[name] || ''])),
    validationSchema: object({
      schoolName: string().trim().max(254, 'fieldTooLong').required('schoolRequired'),
      contractManagerName: string().trim().max(254, 'fieldTooLong').required('supervisorRequired'),
      phoneNumber: string().transform(normalizePhone).matches(phonePattern, { message: 'phoneInvalid', excludeEmptyString: true }).required('phoneRequired'),
      email: string().trim().max(254, 'fieldTooLong').email('emailInvalid').required('emailRequired'),
    }),
    onSubmit: async (values) => {
      setError('')
      try {
        await onSave({
          schoolName: values.schoolName.trim(), contractManagerName: values.contractManagerName.trim(),
          phoneNumber: normalizePhone(values.phoneNumber), email: values.email.trim().toLowerCase(),
        }, school)
      } catch (err) {
        setError(err.response?.data?.code === 'SCHOOL_ALREADY_REGISTERED' ? 'alreadyRegistered' : err.response?.status === 404 ? 'recordMissing' : 'saveError')
      }
    },
  })
  const busy = formik.isSubmitting || deleting
  const editing = mode === 'create' || mode === 'edit'

  useEffect(() => {
    const element = dialog.current
    element.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  async function remove() {
    setDeleting(true)
    setError('')
    try { await onDelete(school) } catch (err) {
      setError(err.response?.status === 404 ? 'recordMissing' : 'deleteError')
      setDeleting(false)
    }
  }

  return (
    <dialog ref={dialog} aria-labelledby="record-dialog-title" onCancel={(event) => { event.preventDefault(); if (!busy) onClose() }} className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-xl bg-white p-6 text-gray-900 shadow-xl backdrop:bg-black/60 dark:bg-gray-900 dark:text-white">
      <div className="mb-6 flex items-start justify-between gap-4">
        <h2 id="record-dialog-title" className="text-xl font-bold">{t({ create: 'addRegistration', edit: 'editRegistration', view: 'registrationDetails', delete: 'deleteRegistration' }[mode])}</h2>
        <button type="button" onClick={onClose} disabled={busy} aria-label={t('close')} className="rounded px-2 text-2xl disabled:opacity-50">×</button>
      </div>
      {editing ? (
        <form onSubmit={formik.handleSubmit} noValidate>
          <fieldset disabled={busy} className="grid gap-5 sm:grid-cols-2">
            {fields.map(({ name, label, ...props }) => {
              const invalid = formik.touched[name] && Boolean(formik.errors[name])
              return <div key={name}>
                <label htmlFor={`record-${name}`} className="mb-2 block font-semibold">{t(label)} *</label>
                <input {...props} id={`record-${name}`} name={name} required maxLength={name === 'phoneNumber' ? 25 : 254} value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={invalid || undefined} aria-describedby={invalid ? `record-${name}-error` : undefined} className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:outline-primary" />
                {invalid && <p id={`record-${name}-error`} role="alert" className="mt-2 text-sm text-red-700 dark:text-red-300">{t(formik.errors[name])}</p>}
              </div>
            })}
          </fieldset>
          {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-red-800 dark:bg-red-950">{t(error)}</p>}
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="submit" disabled={busy} className="rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-secondary disabled:opacity-50">{t(busy ? 'saving' : 'saveRegistration')}</button>
            <button type="button" onClick={onClose} disabled={busy} className="rounded-lg border border-gray-300 px-5 py-3 disabled:opacity-50">{t('cancel')}</button>
          </div>
        </form>
      ) : mode === 'delete' ? (
        <>
          <p className="break-words font-semibold">{school.schoolName}</p>
          <p className="mt-3 text-gray-600 dark:text-gray-300">{t('deleteConfirmation')}</p>
          {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-red-800 dark:bg-red-950">{t(error)}</p>}
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" disabled={busy} onClick={remove} className="rounded-lg bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50">{t(busy ? 'deleting' : 'confirmDelete')}</button>
            <button type="button" disabled={busy} onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-3 disabled:opacity-50">{t('cancel')}</button>
          </div>
        </>
      ) : (
        <>
          <dl className="space-y-5">
            {fields.map(({ name, label, dir }) => <div key={name}><dt className="text-sm text-gray-500 dark:text-gray-300">{t(label)}</dt><dd dir={dir} className="mt-1 break-words font-semibold text-start">{school[name] || '—'}</dd></div>)}
            <div><dt className="text-sm text-gray-500 dark:text-gray-300">{t('registeredAt')}</dt><dd className="mt-1 font-semibold">{school.createdAt && !Number.isNaN(Date.parse(school.createdAt)) ? new Date(school.createdAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-GB') : '—'}</dd></div>
          </dl>
          <div className="mt-7 flex gap-3"><button type="button" onClick={() => onEdit(school)} className="rounded-lg bg-primary px-5 py-3 text-white">{t('edit')}</button><button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-5 py-3">{t('close')}</button></div>
        </>
      )}
    </dialog>
  )
}

RecordDialog.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit', 'view', 'delete']).isRequired,
  school: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
}
