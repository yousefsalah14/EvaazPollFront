import { localDateKey } from './registrations.js'

export async function createRegistrationWorkbook(schools, t, language) {
  const { default: ExcelJS } = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Evaaz'
  workbook.created = new Date()
  const sheet = workbook.addWorksheet(t('registrationsSheet'), {
    views: [{ state: 'frozen', ySplit: 1, rightToLeft: language === 'ar' }],
  })
  sheet.columns = [
    { header: t('schoolName'), key: 'schoolName', width: 38 },
    { header: t('supervisorName'), key: 'contractManagerName', width: 30 },
    { header: t('phoneNumber'), key: 'phoneNumber', width: 24, style: { numFmt: '@' } },
    { header: t('email'), key: 'email', width: 38 },
    { header: t('registeredAt'), key: 'createdAt', width: 18 },
  ]
  schools.forEach((school) => sheet.addRow({
    // Explicit string cells preserve Arabic, leading zeroes and formula-like input as text.
    schoolName: String(school.schoolName || ''),
    contractManagerName: String(school.contractManagerName || ''),
    phoneNumber: String(school.phoneNumber || ''),
    email: String(school.email || ''),
    createdAt: localDateKey(school.createdAt),
  }))
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF207DA9' } }
  sheet.getRow(1).height = 28
  sheet.autoFilter = { from: 'A1', to: `E${sheet.rowCount}` }
  return workbook.xlsx.writeBuffer()
}

export async function exportRegistrations(schools, t, language) {
  const buffer = await createRegistrationWorkbook(schools, t, language)
  const url = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `evaaz-registrations-${localDateKey(new Date())}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
