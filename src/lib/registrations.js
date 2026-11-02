import { normalizePhone } from './phone.js'

export function localDateKey(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function filterRegistrations(schools, { search = '', schoolName = '', from = '', to = '', sort = 'newest' } = {}, language = 'en') {
  const query = search.trim().toLocaleLowerCase()
  const phoneQuery = normalizePhone(query)
  return schools.filter((school) => {
    const matchesSearch = !query || [school.schoolName, school.contractManagerName, school.phoneNumber, school.email]
      .some((value) => String(value || '').toLocaleLowerCase().includes(query))
      || (phoneQuery && normalizePhone(school.phoneNumber || '').includes(phoneQuery))
    const date = localDateKey(school.createdAt)
    return matchesSearch && (!schoolName || school.schoolName === schoolName)
      && (!from || (date && date >= from)) && (!to || (date && date <= to))
  }).sort((a, b) => {
    if (sort === 'name') return String(a.schoolName || '').localeCompare(String(b.schoolName || ''), language)
    const difference = (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)
    return sort === 'oldest' ? -difference : difference
  })
}
