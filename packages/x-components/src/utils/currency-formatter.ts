/**
 * Regex to detect the format.
 */
const FORMAT_REGEX = /(i([^id]+))?i+(([^id?]+)(\?)?(d+))?/;

/**
 * Configuration for format currency.
 */
interface CurrencyConfig {
  /** The character between a group of three integer 'i's and the following one. */
  integerSeparator: string;
  /** The character between a group of three integer 'i's and the following one. It also
   * supports more than one single character. */
  decimalSeparator: string;
  /** Length of decimals numbers. It counts the number of 'd's after the integer part. */
  decimalsNumber: number;
  /** Boolean value to hide or show the decimal part when it has 0. */
  hideIntegerDecimals: boolean;
}

/**
 * Parts of number: integer and decimal.
 */
interface NumberParts {
  /** Integer part of the number as string. */
  integer: string;
  /** Decimal part of the number as string. */
  decimal: string;
}

/**
 * Format a value with a given format.
 *
 * @param value - Numeric value to be formatted.
 * @param format - Format or mask to be defined as string.
 *
 * @remarks
 * Format:
 * - Use 'i' to define integer numbers.
 * - Use 'd' to define decimal numbers. You can define the length of the decimal part. If the
 * doesn't include decimals, it is filled with zeros until reach the length defined with 'd's.
 * - Integer separator must be defined between the 3rd and the 4th integer 'i' of a group.
 * - Decimal separator must be defined between the last 'i' and the first 'd'. It can be more
 * than one character.
 * - Set whatever you need around the integers and decimals marks.
 * - Default mask: 'i.iii,dd' which returns '1.345,67'.
 *
 * @remarks
 * hideIntegerDecimals:
 * - If true and the value is an integer without decimals, the decimal part is hidden including
 * the decimal separator.
 * - If false, the default behaviour will fill with zeros the remaining length until getting
 * the one defined with the 'd's.
 *
 * @returns Formatted number.
 *
 * @public
 */
export function currencyFormatter(value: number, format = 'i.iii,dd'): string {
  const { integer, decimal } = numberParts(value);
  const { decimalSeparator, decimalsNumber, integerSeparator, hideIntegerDecimals } =
    currencyConfig(format);

  const formattedInteger = formatInteger(integer, integerSeparator);
  const formattedDecimalsSeparator = formatDecimalSeparator(
    decimal,
    decimalSeparator,
    hideIntegerDecimals
  );
  const formattedDecimal = formatDecimal(decimal, decimalsNumber, hideIntegerDecimals);
  debugger;
  return format.replace(
    FORMAT_REGEX,
    `${formattedInteger}${formattedDecimalsSeparator}${formattedDecimal}`
  );
}

/**
 * Returns the formatted integer part. This computed returns:
 * - integer part with the integer separator added.
 *
 * @param integer - Integer value as a string.
 * @param integerSeparator - Separator to apply in the integer side.
 *
 * The regexp adds the integer separator for each thousand group (each 3 numbers).
 *
 * @returns Formatted integer.
 *
 * @internal
 */
function formatInteger(integer: string, integerSeparator: string): string {
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, integerSeparator);
}

/**
 * Formatted decimal separator.
 * Returns the decimal separator set or empty string if the option 'hideIntegerDecimals' is true
 * and the value is an integer, or if there are no decimals number defined.
 *
 * @param decimal - Decimal part of the number.
 * @param decimalSeparator - Decimal separator.
 * @param hideIntegerDecimals - Boolean value to hide or show the decimal part.
 *
 * @returns Decimal separator or empty string.
 *
 * @internal
 */
function formatDecimalSeparator(
  decimal: string,
  decimalSeparator: string,
  hideIntegerDecimals: boolean
): string {
  return hideIntegerDecimals && !+decimal ? '' : decimalSeparator;
}

/**
 * Returns the formatted decimal. This computed returns:
 * - decimal part filled with zeros until complete remaining slots defined with the decimal
 * length in the format.
 * - decimal part truncated. The decimal numbers length, defined with the number of 'd's in the
 * format prop. This must MATCH with the number of decimals provided from the adapter.
 *
 * @param decimal - Decimal part as a string.
 * @param decimalsNumber - Amount of decimal numbers.
 * @param hideIntegerDecimals - Boolean value to hide or show the decimal part.
 *
 * @returns Formatted integer.
 *
 * @internal
 */
function formatDecimal(
  decimal: string,
  decimalsNumber: number,
  hideIntegerDecimals: boolean
): string {
  debugger;
  return hideIntegerDecimals && !+decimal
    ? ''
    : decimal.padEnd(decimalsNumber, '0').substring(0, decimalsNumber);
}

/**
 * Function that divide fhe format passed as value for get integerSeparator, decimalSeparator
 * and decimalsNumber.
 *
 * @param format - Format or mask to apply to the value.
 *
 * @returns Object with properties of the currency config.
 *
 * @internal
 */
function currencyConfig(format: string): CurrencyConfig {
  const [
    ,
    ,
    integerSeparator = '',
    ,
    decimalSeparator = '',
    hideIntegerDecimals = '',
    decimals = ''
  ] = FORMAT_REGEX.exec(format) ?? [];
  debugger;
  return {
    integerSeparator,
    decimalSeparator,
    decimalsNumber: decimals.length,
    hideIntegerDecimals: !!hideIntegerDecimals
  };
}

/**
 * Divide the number in two parts by separator '.', one of them is the integer number and other
 * the decimals numbers.
 *
 * @param value - Numeric value to be formatted.
 *
 * @returns Parts of number.
 *
 * @internal
 */
function numberParts(value: number): NumberParts {
  const [integer, decimal = ''] = `${value}`.split('.');
  return {
    integer,
    decimal
  };
}
