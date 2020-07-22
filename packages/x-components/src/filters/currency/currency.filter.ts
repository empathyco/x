import { deepMerge } from '@empathybroker/deep-merge';
import { CurrencyOptions } from '../../i18n/index';
import { XPlugin } from '../../plugins/x-plugin';
import currencyFormatter from './currency-formatter';
/**
 * Applies the currency formatter to a value.
 *
 * @param value - The value to be formatted.
 * @param currencyParams - A partial currency options to set custom options.
 * @returns Formatted value.
 * @public
 */
export function currency(value: number, currencyParams: Partial<CurrencyOptions> = {}): string {
  const defaultOptions = XPlugin.xConfig.currencyOptions;
  const customOptions = deepMerge({}, defaultOptions, currencyParams);
  return currencyFormatter.format(value, customOptions);
}
