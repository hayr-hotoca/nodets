import { describe, expect, it } from 'vitest'
import numberToWords from './number-to-words'

describe('numberToWords (nextjs)', () => {
  it('tra ve "Không đồng" với 0', () => {
    expect(numberToWords(0)).toBe('Không đồng')
  })

  it('đọc đúng số có 3 chữ số', () => {
    expect(numberToWords(125)).toBe('Một trăm hai mươi lăm đồng')
  })

  it('đọc đúng số có hàng nghìn', () => {
    expect(numberToWords(12000)).toBe('Mười hai nghìn đồng')
  })

  it('làm tròn số thực trước khi đọc', () => {
    expect(numberToWords(15.8)).toBe('Mười sáu đồng')
  })
})
