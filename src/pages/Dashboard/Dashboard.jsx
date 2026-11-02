import { useCallback, useEffect, useState } from 'react'
import { Download, Plus, Search, RefreshCw, Eye, Pencil, Trash2, School, CalendarDays, CalendarRange, ListFilter } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'
import api from '../../lib/api'
import { filterRegistrations, localDateKey } from '../../lib/registrations'
import RecordDialog from './RecordDialog'

const defaultFilters = { search: '', schoolName: '', from: '', to: '', sort: 'newest' }
const inputClass = 'w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 focus:outline-primary'

export default function Dashboard() {
  const { token, logout } = useAuth()
  const { t, language } = useLanguage()
  const [schools, setSchools] = useState([])
  const [filters, setFilters] = useState(defaultFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [notice, setNotice] = useState(null)
  const [dialog, setDialog] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const loadSchools = useCallback(async (signal) => {
    setLoading(true)
    setError(false)
    try {
      const { data } = await api.get('/school/allschools', { headers: { token }, signal })
      if (!signal?.aborted) setSchools(data.schools || data['المدارس'] || [])
    } catch (error) {
      if (error.code !== 'ERR_CANCELED') setError(true)
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [token])

  useEffect(() => {
    const controller = new AbortController()
    loadSchools(controller.signal)
    return () => controller.abort()
  }, [loadSchools])

  function changeFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }))
    setPage(1)
  }

  const invalidDateRange = Boolean(filters.from && filters.to && filters.from > filters.to)
  const visibleSchools = filterRegistrations(schools, filters, language)
  const schoolNames = [...new Set([...schools.map((school) => school.schoolName), filters.schoolName].filter(Boolean))].sort((a, b) => a.localeCompare(b, language))
  const pageCount = Math.max(1, Math.ceil(visibleSchools.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const offset = (currentPage - 1) * pageSize
  const pageSchools = visibleSchools.slice(offset, offset + pageSize)
  const today = localDateKey(new Date())
  const stats = [
    { label: 'registrationsCount', value: schools.length, icon: School },
    { label: 'registeredToday', value: schools.filter((school) => localDateKey(school.createdAt) === today).length, icon: CalendarDays },
    { label: 'registeredThisMonth', value: schools.filter((school) => localDateKey(school.createdAt).startsWith(today.slice(0, 7))).length, icon: CalendarRange },
    { label: 'filteredResults', value: visibleSchools.length, icon: ListFilter },
  ]
  const formatCount = (value) => value.toLocaleString(language)

  async function saveRecord(values, school) {
    const { data } = school
      ? await api.patch(`/school/${school._id}`, values, { headers: { token } })
      : await api.post('/school', values, { headers: { token } })
    setSchools((current) => school ? current.map((record) => record._id === school._id ? data.school : record) : [data.school, ...current])
    setDialog(null)
    setNotice({ key: school ? 'recordUpdated' : 'recordCreated', error: false })
  }

  async function deleteRecord(school) {
    await api.delete(`/school/${school._id}`, { headers: { token } })
    setSchools((current) => current.filter((record) => record._id !== school._id))
    setDialog(null)
    setNotice({ key: 'recordDeleted', error: false })
  }

  async function downloadExcel() {
    setExporting(true)
    setNotice(null)
    try {
      const { exportRegistrations } = await import('../../lib/exportRegistrations')
      await exportRegistrations(visibleSchools, t, language)
    } catch {
      setNotice({ key: 'exportError', error: true })
    } finally { setExporting(false) }
  }

  const openDialog = (mode, school) => { setNotice(null); setDialog({ mode, school }) }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-primary">{t('dashboard')}</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{t('registrationsTitle')}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t('dashboardIntro')}</p>
        </div>
        <button disabled={signingOut} onClick={async () => { setSigningOut(true); try { await logout() } catch { /* Session is cleared even when the server is unavailable. */ } }} className="rounded-lg border border-primary px-5 py-2 text-primary disabled:opacity-60">{t('logout')}</button>
      </div>

      <section aria-label={t('registrationStatistics')} className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-5">
          <div className="flex items-center justify-between gap-3"><p className="text-sm text-gray-600 dark:text-gray-300">{t(label)}</p><Icon size={20} aria-hidden="true" className="shrink-0 text-primary" /></div>
          <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{loading || error ? '—' : formatCount(value)}</p>
        </div>)}
      </section>

      {notice && <div role={notice.error ? 'alert' : 'status'} className={`mb-5 flex items-center justify-between gap-4 rounded-lg p-4 ${notice.error ? 'bg-red-50 text-red-800 dark:bg-red-950' : 'bg-green-50 text-green-800 dark:bg-green-950'}`}><p>{t(notice.key)}</p><button onClick={() => setNotice(null)} aria-label={t('close')} className="px-2 text-xl">×</button></div>}

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold">{t('manageRegistrations')}</h2>
          <div className="flex flex-wrap gap-2">
            <button disabled={loading} onClick={() => loadSchools()} className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm disabled:opacity-50"><RefreshCw size={16} aria-hidden="true" />{t('refresh')}</button>
            <button disabled={loading || error || exporting || visibleSchools.length === 0 || invalidDateRange} onClick={downloadExcel} title={t('exportHint')} className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary disabled:opacity-50"><Download size={16} aria-hidden="true" />{t(exporting ? 'exporting' : 'exportExcel')}</button>
            <button disabled={loading || error} onClick={() => openDialog('create')} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-secondary disabled:opacity-50"><Plus size={16} aria-hidden="true" />{t('addRegistration')}</button>
          </div>
        </div>

        <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <label htmlFor="registration-search" className="mb-2 block text-sm font-semibold">{t('search')}</label>
            <div className="relative"><Search size={18} aria-hidden="true" className="pointer-events-none absolute start-3 top-4 text-gray-400" /><input id="registration-search" type="search" value={filters.search} onChange={(event) => changeFilter('search', event.target.value)} placeholder={t('searchPlaceholder')} className={`${inputClass} ps-10`} /></div>
          </div>
          <div><label htmlFor="school-filter" className="mb-2 block text-sm font-semibold">{t('schoolName')}</label><select id="school-filter" value={filters.schoolName} onChange={(event) => changeFilter('schoolName', event.target.value)} className={inputClass}><option value="">{t('allSchools')}</option>{schoolNames.map((name) => <option key={name} value={name}>{name}</option>)}</select></div>
          <div><label htmlFor="registration-sort" className="mb-2 block text-sm font-semibold">{t('sortBy')}</label><select id="registration-sort" value={filters.sort} onChange={(event) => changeFilter('sort', event.target.value)} className={inputClass}>{['newest', 'oldest', 'name'].map((key) => <option key={key} value={key}>{t(`sort_${key}`)}</option>)}</select></div>
          <div><label htmlFor="date-from" className="mb-2 block text-sm font-semibold">{t('dateFrom')}</label><input id="date-from" type="date" value={filters.from} max={filters.to || undefined} onChange={(event) => changeFilter('from', event.target.value)} className={inputClass} /></div>
          <div><label htmlFor="date-to" className="mb-2 block text-sm font-semibold">{t('dateTo')}</label><input id="date-to" type="date" value={filters.to} min={filters.from || undefined} onChange={(event) => changeFilter('to', event.target.value)} className={inputClass} /></div>
          <div className="flex flex-wrap items-center gap-4 pb-1 sm:col-span-2"><button onClick={() => { setFilters(defaultFilters); setPage(1) }} className="rounded-lg border border-gray-300 px-4 py-3 text-sm">{t('clearFilters')}</button><p className="text-xs text-gray-500 dark:text-gray-300">{t('exportHint')}</p></div>
        </div>
        {invalidDateRange && <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-300">{t('invalidDateRange')}</p>}

        {loading ? <p role="status" className="py-12 text-center">{t('loading')}</p> : error ? <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-950">{t('loadError')}</p> : visibleSchools.length === 0 ? <p role="status" className="py-12 text-center text-gray-600 dark:text-gray-300">{t(schools.length ? 'noMatches' : 'noRegistrations')}</p> : (
          <>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-start text-sm">
                <caption className="sr-only">{t('registrationsTitle')}</caption>
                <thead className="bg-gray-50 text-gray-700 dark:text-gray-200"><tr>{['schoolName', 'supervisorName', 'phoneNumber', 'email', 'registeredAt', 'actions'].map((key) => <th key={key} scope="col" className="whitespace-nowrap p-3 text-start">{t(key)}</th>)}</tr></thead>
                <tbody>{pageSchools.map((school) => <tr key={school._id} className="border-t border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  <td className="min-w-[150px] p-3 font-semibold">{school.schoolName}</td>
                  <td className="min-w-[130px] p-3">{school.contractManagerName}</td>
                  <td className="whitespace-nowrap p-3"><a href={'tel:' + school.phoneNumber} dir="ltr" className="text-primary">{school.phoneNumber}</a></td>
                  <td className="p-3">{school.email ? <a href={'mailto:' + school.email} dir="ltr" className="text-primary">{school.email}</a> : '—'}</td>
                  <td className="whitespace-nowrap p-3">{localDateKey(school.createdAt) ? new Date(school.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB') : '—'}</td>
                  <td className="p-3"><div className="flex gap-1">
                    {[{ mode: 'view', label: 'view', icon: Eye }, { mode: 'edit', label: 'edit', icon: Pencil }, { mode: 'delete', label: 'delete', icon: Trash2 }].map(({ mode, label, icon: Icon }) => <button key={mode} onClick={() => openDialog(mode, school)} aria-label={`${t(label)}: ${school.schoolName}`} title={t(label)} className={`rounded-lg p-2 hover:bg-gray-100 focus-visible:outline-primary dark:hover:bg-gray-700 ${mode === 'delete' ? 'text-red-700 dark:text-red-300' : 'text-primary'}`}><Icon size={18} aria-hidden="true" /></button>)}
                  </div></td>
                </tr>)}</tbody>
              </table>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5 text-sm dark:border-gray-700">
              <p aria-live="polite">{t('showing')} {formatCount(offset + 1)}–{formatCount(Math.min(offset + pageSize, visibleSchools.length))} {t('of')} {formatCount(visibleSchools.length)}</p>
              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="page-size">{t('rowsPerPage')}</label><select id="page-size" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1) }} className="rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900">{[10, 25, 50, 100].map((size) => <option key={size} value={size}>{formatCount(size)}</option>)}</select>
                <button disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="rounded-lg border border-gray-300 px-3 py-2 disabled:opacity-40">{t('previous')}</button>
                <span>{formatCount(currentPage)} / {formatCount(pageCount)}</span>
                <button disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)} className="rounded-lg border border-gray-300 px-3 py-2 disabled:opacity-40">{t('next')}</button>
              </div>
            </div>
          </>
        )}
      </section>
      {dialog && <RecordDialog key={`${dialog.mode}-${dialog.school?._id || 'new'}`} {...dialog} onClose={() => setDialog(null)} onSave={saveRecord} onDelete={deleteRecord} onEdit={(school) => openDialog('edit', school)} />}
    </main>
  )
}
