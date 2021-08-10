import { currencyFormatter } from '../currency-formatter';

describe('testing Currency formatter', () => {
  it('formats the currency with the default options', () => {
    expect(format(1234.2345)).toBe('1.234,23');
  });

  it('formats large currency numbers', () => {
    expect(format(123456789.123)).toBe('123.456.789,12');
  });

  it('allows to add the currency symbol', () => {
    expect(format(1234.2345, 'i.iii,dd $')).toBe('1.234,23 $');
  });

  it('allows to change the currency symbol location', () => {
    expect(format(1234.2345, '$ i.iii,dd')).toBe('$ 1.234,23');
  });

  it('allows to change the decimal separator', () => {
    expect(format(1234.2345, 'i,iii.dd')).toBe('1,234.23');
  });

  it('allows to change the amount of decimal digits', () => {
    expect(format(1234.2345, 'i.iii,d')).toBe('1.234,2');
  });

  it('allows to hide the decimal part', () => {
    expect(format(1234.56, 'i.iii')).toBe('1.234');
  });

  it("allows to hide the decimal part if it's zero with the '?' symbol within the format", () => {
    expect(format(1234, 'i.iii,dd')).toBe('1.234,00');
    expect(format(1234, 'i.iii,?dd')).toBe('1.234');
    expect(format(1234.56, 'i.iii,?dd')).toBe('1.234,56');
  });

  it('adds thousands separator successfully when the number has decimals', () => {
    expect(format(1234567.123456)).toBe('1.234.567,12');
  });

  it('adds thousands separator successfully when the number does not have decimals', () => {
    expect(format(1234567.123456, 'i.iii')).toBe('1.234.567');
  });

  // eslint-disable-next-line max-len
  it('does not add thousands separator when the integer part is smaller than 1000 and rounding is disabled', () => {
    expect(format(999.999)).toBe('999,99');
  });

  it('takes care of thousands separator edge cases', () => {
    expect(format(123)).toBe('123,00');
    expect(format(123456)).toBe('123.456,00');
  });

  function format(value: number, format?: string): string {
    return currencyFormatter(value, format);
  }
});
