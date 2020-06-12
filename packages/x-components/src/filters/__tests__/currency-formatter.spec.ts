import { CurrencyOptions } from '../../i18n/currency.types';
import { DEFAULT_X_CONFIG } from '../../plugins/x-plugin.config';
import currencyFormatter from '../currency/currency-formatter';

describe('testing Currency formatter', () => {
  it('formats the currency with the default options', () => {
    expect(format(1234.2345)).toBe('1.234,23 €');
  });

  it('formats large currency numbers', () => {
    expect(format(123456789.123)).toBe('123.456.789,12 €');
  });

  it('allows to change the currency symbol', () => {
    expect(format(1234.2345, { symbol: '$' })).toBe('1.234,23 $');
  });

  it('allows to change the currency symbol location', () => {
    expect(format(1234.2345, { currencyLocation: 'prepend' })).toBe('€ 1.234,23');
  });

  it('allows to disable currency spacing', () => {
    expect(format(1234.2345, { currencySpacing: false })).toBe('1.234,23€');
  });

  it('allows to change the decimal separator', () => {
    expect(format(1234.2345, { decimalSeparator: '.' })).toBe('1.234.23 €');
  });

  it('allows to change the amount of decimal digits', () => {
    expect(format(1234.2345, { decimalDigits: 1 })).toBe('1.234,2 €');
  });

  it('allows to hide non significant decimals', () => {
    expect(format(1234.0, { hideDecimalsIfZero: true })).toBe('1.234 €');
  });

  it('truncates lower edgy cases successfully', () => {
    expect(format(1.9999999, { roundingMethod: 'truncate' })).toBe('1,99 €');
  });

  it('preserves non significant decimals when truncate rounding mode is enabled', () => {
    expect(format(2.0, { roundingMethod: 'truncate' })).toBe('2,00 €');
  });

  it('rounds edgy upper cases successfully', () => {
    expect(format(1.5, { decimalDigits: 0 })).toBe('2 €');
  });

  it('rounds edgy lower cases successfully', () => {
    expect(format(1.49999, { decimalDigits: 0 })).toBe('1 €');
  });

  it('adds thousands separator successfully when the number has decimals', () => {
    expect(format(1234567.123456)).toBe('1.234.567,12 €');
  });

  it('adds thousands separator successfully when the number does not have decimals', () => {
    expect(format(1234567.123456, { decimalDigits: 0 })).toBe('1.234.567 €');
  });

  // eslint-disable-next-line max-len
  it('does not add thousands separator when the integer part is smaller than 1000 and rounding is disabled', () => {
    expect(format(999.999, { roundingMethod: 'truncate' })).toBe('999,99 €');
  });

  // eslint-disable-next-line max-len
  it('adds thousands separator when the integer part is smaller than 1000, but it has to round it to 1000', () => {
    expect(format(999.999)).toBe('1.000,00 €');
  });

  it('allows to override thousands separator', () => {
    expect(format(123456789.0, { thousandsSeparator: '' })).toBe('123456789,00 €');
  });

  it('takes care of thousands separator edge cases', () => {
    expect(format(123)).toBe('123,00 €');
    expect(format(123456)).toBe('123.456,00 €');
  });

  function format(value: number, options: Partial<CurrencyOptions> = {}): string {
    return currencyFormatter.format(value, { ...DEFAULT_X_CONFIG.currencyOptions, ...options });
  }
});
