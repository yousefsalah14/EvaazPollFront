export const phonePattern = /^(?:05\d{8}|5\d{8}|(?:\+966|00966|966)5\d{8})$/

export function normalizePhone(value) {
  return typeof value === 'string'
    ? value.replace(/[٠-٩۰-۹]/g, (digit) => String(digit.charCodeAt(0) - (digit >= '۰' ? 0x06f0 : 0x0660))).replace(/[\s()-]/g, '')
    : value
}
