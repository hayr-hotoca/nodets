import { numberToWords } from '../common/utils/number-to-words';

describe('numberToWords (nestjs)', () => {
  it('tra ve "Không đồng" với 0', () => {
    expect(numberToWords(0)).toBe('Không đồng');
  });

  it('đọc đúng số có hàng nghìn', () => {
    expect(numberToWords(12000)).toBe('Mười hai nghìn đồng');
  });
});
