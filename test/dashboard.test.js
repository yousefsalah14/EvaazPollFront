import assert from 'node:assert/strict'
import { test } from 'node:test'
import ExcelJS from 'exceljs'
import { filterRegistrations, localDateKey } from '../src/lib/registrations.js'
import { createRegistrationWorkbook } from '../src/lib/exportRegistrations.js'

const records = [
  { _id: 'a', schoolName: 'مدرسة النور', contractManagerName: 'Ahmed', phoneNumber: '0512345678', email: 'ahmed@example.com', createdAt: new Date(2026, 10, 2, 23, 59).toISOString() },
  { _id: 'b', schoolName: 'Branch B', contractManagerName: 'Sara', phoneNumber: '+966512345679', email: 'sara@example.com', createdAt: new Date(2026, 10, 1, 0, 1).toISOString() },
  { _id: 'c', schoolName: 'Branch C', contractManagerName: 'Ali', phoneNumber: '0512345680', email: 'ali@example.com', createdAt: new Date(2026, 9, 31, 23, 59).toISOString() },
]

test('searches Arabic names, all contact fields and normalized Saudi phone input', () => {
  for (const search of ['النور', ' AHMED ', 'AHMED@EXAMPLE.COM', '٠٥١٢٣٤٥٦٧٨', '051 234 5678']) {
    assert.deepEqual(filterRegistrations(records, { search }).map((record) => record._id), ['a'], search)
  }
  assert.equal(filterRegistrations(records, { search: 'absent' }).length, 0)
})

test('combines school, search and inclusive local date boundaries', () => {
  assert.equal(localDateKey(records[0].createdAt), '2026-11-02')
  assert.deepEqual(filterRegistrations(records, { from: '2026-11-01', to: '2026-11-02' }).map((record) => record._id), ['a', 'b'])
  assert.deepEqual(filterRegistrations(records, { from: '2026-11-02', to: '2026-11-02', schoolName: 'مدرسة النور', search: 'Ahmed' }).map((record) => record._id), ['a'])
  assert.equal(filterRegistrations(records, { from: '2026-11-03', to: '2026-11-01' }).length, 0)
  assert.equal(filterRegistrations([{ ...records[0], createdAt: undefined }], { from: '2026-01-01' }).length, 0)
  assert.equal(localDateKey('invalid'), '')
})

test('sorts results without mutating source data', () => {
  assert.deepEqual(filterRegistrations(records, { sort: 'oldest' }).map((record) => record._id), ['c', 'b', 'a'])
  const byName = filterRegistrations(records, { sort: 'name' })
  assert.equal(byName[0]._id, 'b')
  assert.deepEqual(records.map((record) => record._id), ['a', 'b', 'c'])
})

test('writes a real XLSX with every matching row, Arabic text, text phones and safe formula-like names', async () => {
  const selected = Array.from({ length: 26 }, (_, index) => ({ ...records[0], schoolName: index ? records[0].schoolName : '=HYPERLINK("https://example.com")' }))
  const buffer = await createRegistrationWorkbook(selected, (key) => ({ registrationsSheet: 'التسجيلات', schoolName: 'اسم المدرسة' }[key] || key), 'ar')
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)
  const sheet = workbook.getWorksheet('التسجيلات')
  assert.equal(sheet.rowCount, 27)
  assert.equal(sheet.getCell('A1').value, 'اسم المدرسة')
  assert.equal(sheet.getCell('A2').type, ExcelJS.ValueType.String)
  assert.equal(sheet.getCell('A2').value, selected[0].schoolName)
  assert.equal(sheet.getCell('A3').value, 'مدرسة النور')
  assert.equal(sheet.getCell('C2').type, ExcelJS.ValueType.String)
  assert.equal(sheet.getCell('C2').value, '0512345678')
  assert.equal(sheet.getCell('E2').value, '2026-11-02')
  assert.equal(sheet.views[0].rightToLeft, true)
  assert.equal(sheet.views[0].ySplit, 1)
})
