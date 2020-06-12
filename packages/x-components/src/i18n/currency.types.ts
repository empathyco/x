/**
 * Available options to format currency values.
 *
 * @public
 */
export interface CurrencyOptions {
  /** Currency symbol (i.e. €, $, etc...). */
  symbol: string;
  /** Currency position (i.e. 'prepend', 'append'). */
  currencyLocation: CurrencyLocation;
  /** Space between the number and the currency. */
  currencySpacing: boolean;
  /** Decimal separator (i.e. ',', '.'). */
  decimalSeparator: DecimalSeparator;
  /** Number of decimal to display. */
  decimalDigits: number;
  /** Hides the decimal part if its zero. */
  hideDecimalsIfZero: boolean;
  /** Rounding method (i.e. 'round' | 'truncate'). */
  roundingMethod: RoundingMethod;
  /** Thousand separator (i.e. ',', '.'). */
  thousandsSeparator: ThousandsSeparator;
}

/**
 * Position where the currency symbol will be placed.
 *
 * @public
 */
export type CurrencyLocation = 'prepend' | 'append';
/**
 * Character to separate the decimal part.
 *
 * @public
 */
export type DecimalSeparator = ',' | '.';
/**
 * Approximation for a number.
 *
 * @public
 */
export type RoundingMethod = 'round' | 'truncate';
/**
 * Character to separate the thousand part.
 *
 * @public
 */
export type ThousandsSeparator = '' | ' ' | ',' | '.';
