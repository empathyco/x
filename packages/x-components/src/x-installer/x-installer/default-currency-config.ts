import { CurrencyOptions } from '../../i18n/currency.types';

/**
 * The default configuration for {@link CurrencyOptions} used in {@link XInstaller} as fallback
 * values.
 *
 * @internal
 */
export const defaultCurrencyOptions: CurrencyOptions = {
  currencyLocation: 'append',
  currencySpacing: true,
  decimalDigits: 2,
  decimalSeparator: '.',
  symbol: '€',
  hideDecimalsIfZero: false,
  roundingMethod: 'round',
  thousandsSeparator: ','
};
