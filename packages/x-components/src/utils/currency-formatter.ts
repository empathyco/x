/**
 * Regex to detect the format.
 */
const FORMAT_REGEX = /(i([^id]+))?i+(([^id?]+)(d+)(\?)?)?/;

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
 * - If you want to hide the decimal part if it's zero (non significant), you can add the `?` symbol
 * after the decimal characters (e.g. 'i.iii,dd?', for `1234` you would get `1.234` instead of
 * `1.234,00`). It defines the value of `hideIntegerDecimals`:
 * - If true (exists) and the value is an integer without decimals, the decimal non significant
 * zeroes are hidden.
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
  const formattedDecimal = formatDecimal(decimal, {
    decimalsNumber,
    hideIntegerDecimals,
    decimalSeparator
  });
  return format.replace(FORMAT_REGEX, `${formattedInteger}${formattedDecimal}`);
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
 * Returns the formatted decimal. This computed returns:
 * - decimal part filled with zeros until complete remaining slots defined with the decimal
 * length in the format.
 * - decimal part truncated. The decimal numbers length, defined with the number of 'd's in the
 * format prop. This must MATCH with the number of decimals provided from the adapter.
 *
 * @param decimal - Decimal part as a string.
 * @param CurrencyConfig - From which the `decimalsNumber`, `decimalsSeparator` and
 * `hideIntegerDecimals` are obtained.
 *
 * @returns Formatted integer.
 *
 * @internal
 */
function formatDecimal(
  decimal: string,
  {
    decimalsNumber,
    decimalSeparator,
    hideIntegerDecimals
  }: Omit<CurrencyConfig, 'integerSeparator'>
): string {
  return hideIntegerDecimals && !+decimal
    ? ''
    : `${decimalSeparator}${decimal.padEnd(decimalsNumber, '0').substring(0, decimalsNumber)}`;
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
    decimals = '',
    hideIntegerDecimals = ''
  ] = FORMAT_REGEX.exec(format) ?? [];
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
