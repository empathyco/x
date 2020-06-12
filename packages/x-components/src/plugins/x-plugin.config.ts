import { XConfig } from './x-plugin.types';

/**
 * Default global {@link XConfig}.
 *
 * @public
 */
export const DEFAULT_X_CONFIG: XConfig = {
  consent: false,
  documentDirection: 'ltr',
  currencyOptions: {
    symbol: '€',
    currencyLocation: 'append',
    currencySpacing: true,
    decimalDigits: 2,
    decimalSeparator: ',',
    hideDecimalsIfZero: false,
    roundingMethod: 'round',
    thousandsSeparator: '.'
  }
};
