/**
 * Chuyển đổi số tiền sang chữ tiếng Việt
 */

const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
const teens = [
  'mười', 'mười một', 'mười hai', 'mười ba', 'mười bốn',
  'mười lăm', 'mười sáu', 'mười bảy', 'mười tám', 'mười chín',
]
const tens = ['', 'mười', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi']

function readThreeDigits(n: number): string {
  if (n === 0) return ''
  const hundred = Math.floor(n / 100)
  const remainder = n % 100
  let result = ''

  if (hundred > 0) {
    result += `${ones[hundred]} trăm`
    if (remainder > 0) result += ' '
  }

  if (remainder > 0) {
    if (remainder < 10) {
      result += `${hundred > 0 ? 'lẻ ' : ''}${ones[remainder]}`
    } else if (remainder < 20) {
      result += teens[remainder - 10]
    } else {
      const ten = Math.floor(remainder / 10)
      const unit = remainder % 10
      result += tens[ten]
      if (unit === 5) result += ' lăm'
      else if (unit === 1 && ten > 1) result += ' mốt'
      else if (unit > 0) result += ` ${ones[unit]}`
    }
  }

  return result
}

export default function numberToWords(amount: number): string {
  if (!Number.isFinite(amount) || Number.isNaN(amount)) return ''

  const intAmount = Math.round(amount) // Làm tròn đến đồng

  if (intAmount === 0) return 'Không đồng'

  const groups: number[] = []
  let n = intAmount
  while (n > 0) {
    groups.push(n % 1000)
    n = Math.floor(n / 1000)
  }

  const groupNames = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ']

  const parts: string[] = []
  for (let i = groups.length - 1; i >= 0; i -= 1) {
    const g = groups[i]
    if (g !== 0) {
      const text = readThreeDigits(g)
      parts.push(`${text}${groupNames[i] ? ` ${groupNames[i]}` : ''}`)
    }
  }

  const result = parts.join(' ')
  // Capitalize first letter
  return `${result.charAt(0).toUpperCase()}${result.slice(1)} đồng`
}
