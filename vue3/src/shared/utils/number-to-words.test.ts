import { describe, expect, it } from 'vitest'
import numberToWords from './number-to-words'

describe('numberToWords (vue3)', () => {
  it('tra ve "Không đồng" với 0', () => {
    expect(numberToWords(0)).toBe('Không đồng')
  })

  it('đọc đúng số có hàng trăm', () => {
    expect(numberToWords(305)).toBe('Ba trăm lẻ năm đồng')
  })

  it('đọc đúng số có hàng triệu', () => {
    expect(numberToWords(2000000)).toBe('Hai triệu đồng')
  })
})
