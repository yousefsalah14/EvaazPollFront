import { useState } from 'react'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import evaazLogo from '../../assets/images/evaazlogo.webp'
import { useLanguage } from '../../contexts/LanguageContext'
import api from '../../lib/api'
import { phonePattern, normalizePhone } from '../../lib/phone'

export default function Form() {
  const { t } = useLanguage()
  const [status, setStatus] = useState(null)
  const formik = useFormik({
    initialValues: { schoolName: '', contractManagerName: '', phoneNumber: '', email: '' },
    validationSchema: object({
      schoolName: string().trim().required('schoolRequired'),
      contractManagerName: string().trim().required('supervisorRequired'),
      phoneNumber: string().transform(normalizePhone).matches(phonePattern, { message: 'phoneInvalid', excludeEmptyString: true }).required('phoneRequired'),
      email: string().trim().email('emailInvalid').required('emailRequired'),
    }),
    onSubmit: async (values, helpers) => {
      setStatus(null)
      try {
        await api.post('/school/register', {
          schoolName: values.schoolName.trim(),
          contractManagerName: values.contractManagerName.trim(),
          phoneNumber: normalizePhone(values.phoneNumber),
          email: values.email.trim().toLowerCase(),
        })
        helpers.resetForm()
        setStatus({ type: 'success', key: 'registrationSuccess' })
      } catch (error) {
        setStatus({ type: 'error', key: error.response?.data?.code === 'SCHOOL_ALREADY_REGISTERED' ? 'alreadyRegistered' : 'registrationError' })
      }
    },
  })

  const fields = [
    { name: 'schoolName', label: 'schoolName', type: 'text', autoComplete: 'organization' },
    { name: 'contractManagerName', label: 'supervisorName', type: 'text', autoComplete: 'name' },
    { name: 'phoneNumber', label: 'phoneNumber', type: 'tel', autoComplete: 'tel', placeholder: '05xxxxxxxx', dir: 'ltr' },
    { name: 'email', label: 'email', type: 'email', autoComplete: 'email', placeholder: 'name@school.com', dir: 'ltr' },
  ]

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="mb-7 text-center">
        <img src={evaazLogo} className="mx-auto mb-4 w-52" alt={t('logoAlt')} />
        <h1 className="text-3xl font-bold text-primary dark:text-white">{t('registrationTitle')}</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">{t('formIntro')}</p>
      </div>
      <form onSubmit={formik.handleSubmit} noValidate className="rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900 sm:p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {fields.map(({ name, label, ...inputProps }) => {
            const invalid = formik.touched[name] && Boolean(formik.errors[name])
            return (
              <div key={name}>
                <label htmlFor={name} className="mb-2 block font-semibold text-gray-900 dark:text-gray-100">{t(label)} <span aria-hidden="true">*</span></label>
                <input {...inputProps} id={name} name={name} required maxLength={name === 'phoneNumber' ? 25 : 254} onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values[name]} aria-invalid={invalid || undefined} aria-describedby={invalid ? name + '-error' : undefined} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:border-primary focus:outline-primary" />
                {invalid && <p id={name + '-error'} className="mt-2 text-sm text-red-700 dark:text-red-300" role="alert">{t(formik.errors[name])}</p>}
              </div>
            )
          })}
        </div>
        {status && <p role={status.type === 'error' ? 'alert' : 'status'} className={status.type === 'error' ? 'mt-6 rounded-lg bg-red-50 p-4 text-red-800' : 'mt-6 rounded-lg bg-green-50 p-4 text-green-800'}>{t(status.key)}</p>}
        <div className="mt-8 flex flex-wrap gap-4">
          <button type="submit" disabled={formik.isSubmitting} className="rounded-lg bg-primary px-8 py-3 font-bold text-white transition hover:bg-secondary disabled:opacity-60">{t(formik.isSubmitting ? 'submitting' : 'submit')}</button>
          <button type="button" disabled={formik.isSubmitting} onClick={() => { formik.resetForm(); setStatus(null) }} className="rounded-lg border border-primary px-6 py-3 text-primary">{t('reset')}</button>
        </div>
      </form>
    </main>
  )
}
