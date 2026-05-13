import { numberToWords } from '../shared/utils/number-to-words';

describe('numberToWords', () => {
  it('should convert 0 to "Không đồng"', () => {
    expect(numberToWords(0)).toBe('Không đồng');
  });

  it('should convert 1000 to "Một nghìn đồng"', () => {
    expect(numberToWords(1000)).toBe('Một nghìn đồng');
  });

  it('should convert 1250000 to "Một triệu hai trăm năm mươi nghìn đồng"', () => {
    expect(numberToWords(1250000)).toBe('Một triệu hai trăm năm mươi nghìn đồng');
  });

  it('should convert 42500000 to "Bốn mươi hai triệu năm trăm nghìn đồng"', () => {
    expect(numberToWords(42500000)).toBe('Bốn mươi hai triệu năm trăm nghìn đồng');
  });

  it('should handle "lẻ" correctly for 105', () => {
    expect(numberToWords(105)).toBe('Một trăm lẻ năm đồng');
  });

  it('should handle "lăm" correctly for 15', () => {
    expect(numberToWords(15)).toBe('Mười lăm đồng');
  });

  it('should handle "mốt" correctly for 21', () => {
    expect(numberToWords(21)).toBe('Hai mươi mốt đồng');
  });
});
