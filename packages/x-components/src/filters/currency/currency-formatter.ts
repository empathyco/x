import { CurrencyOptions } from '../../i18n/currency.types';

/**
 * Currency formatter that formats a number with the default or the custom options.
 */
class CurrencyFormatter {
  /**
   * Creates a new instance of the CurrencyFormatter with the given currency options passed
   * as parameter.
   *
   * @param options - Currency options to apply.
   *
   * @public
   */
  public constructor(
    /**
     * Custom options passed as parameter in the constructor.
     *
     * @internal
     */
    protected options?: CurrencyOptions
  ) {}

  /**
   * Formats the value with the currency options given.
   *
   * @param value - A value to be formatted.
   * @param options - Options to configure the value format.
   *
   * @returns Formatted string.
   *
   * @public
   */
  format(value: number | string, options: CurrencyOptions): string {
    this.options = options;
    const numberValue = this.convertToNumberIfNecessary(value);
    const formattedValue = this.formatValue(numberValue);
    return this.addCurrencySymbolIfNeeded(formattedValue);
  }

  /**
   * Converts a value to a number if its necessary.
   *
   * @param value - The value to be converted into a number.
   * @returns The value as a number.
   *
   * @public
   */
  private convertToNumberIfNecessary(value: number | string): number {
    return typeof value === 'number' ? value : Number.parseFloat(value);
  }

  /**
   * Formats a value.
   *
   * @param value - The value to be formatted.
   * @returns The formatted value.
   *
   * @public
   */
  private formatValue(value: number): string {
    let formattedValue = this.formatDecimals(value);
    formattedValue = this.formatDecimalSeparator(formattedValue);
    formattedValue = this.addThousandsSeparatorIfNeeded(formattedValue);
    return formattedValue;
  }

  /**
   * Formats the decimal part of the value.
   *
   * @param value - The value to be formatted.
   * @returns The formatted value with its decimal part.
   *
   * @public
   */
  private formatDecimals(value: number): string {
    return this.shouldDisplayDecimals(value)
      ? this.formatWithFixedDecimals(value)
      : this.formatWithoutDecimals(value);
  }

  /**
   * Checks if it has to display decimal part or not.
   *
   * @param value - The value to be displayed with decimals or not.
   * @returns A boolean.
   *
   * @public
   */
  private shouldDisplayDecimals(value: number): boolean {
    return !Number.isInteger(value) || !this.options?.hideDecimalsIfZero;
  }

  /**
   * Remove the decimal part of a value.
   *
   * @param value - The value to be formatted.
   * @returns The value without the decimal part.
   *
   * @public
   */
  private formatWithoutDecimals(value: number): string {
    if (this.options?.roundingMethod === 'round') {
      return value.toFixed();
    } else if (this.options?.roundingMethod === 'truncate') {
      return Math.trunc(value).toString();
    }
    return value.toString();
  }

  /**
   * Formats the decimal part.
   *
   * @param value - The value to be converted into a number.
   * @returns The value as a number.
   *
   * @public
   */
  private formatWithFixedDecimals(value: number): string {
    const { roundingMethod, decimalDigits } = this.options as CurrencyOptions;
    if (roundingMethod === 'round') {
      return value.toFixed(decimalDigits);
    } else if (roundingMethod === 'truncate') {
      return this.truncate(value, decimalDigits).toFixed(decimalDigits);
    }
    return value.toString();
  }

  /**
   * Truncate a value.
   *
   * @param value - The value to be truncated.
   * @param digits - The number of digits to be truncated.
   * @returns The truncated value.
   *
   * @public
   */
  private truncate(value: number, digits: number): number {
    const fixed = Math.pow(10, digits);
    return Math.floor(value * fixed) / fixed;
  }

  /**
   * Format the decimal separator.
   *
   * @param formattedValue - The value formatted.
   * @returns The value with a '.' or ',' as decimal separator.
   *
   * @public
   */
  private formatDecimalSeparator(formattedValue: string): string {
    const { decimalSeparator, decimalDigits } = this.options as CurrencyOptions;
    return decimalDigits && decimalSeparator !== '.'
      ? formattedValue.replace('.', decimalSeparator)
      : formattedValue;
  }

  /**
   * Adds thousands separator to the value if its needed.
   *
   * @param formattedValue - The formatted value.
   * @returns The formatted value with or without the thousands separator.
   *
   * @public
   */
  private addThousandsSeparatorIfNeeded(formattedValue: string): string {
    return this.needsThousandsSeparator(formattedValue)
      ? this.addThousandsSeparator(formattedValue)
      : formattedValue;
  }

  /**
   * Checks if the formatted value needs the thousands separator.
   *
   * @param formattedValue - The formatted value.
   * @returns A boolean.
   *
   * @public
   */
  private needsThousandsSeparator(formattedValue: string): boolean {
    const { thousandsSeparator, decimalSeparator } = this.options as CurrencyOptions;
    const wholePart = formattedValue.split(decimalSeparator)[0];
    return !!thousandsSeparator && wholePart.length > 3;
  }

  /**
   * Adds thousands separator to the formatted value.
   *
   * @param formattedValue - The formatted value.
   * @returns The formatted value with the thousands separator.
   *
   * @public
   */
  private addThousandsSeparator(formattedValue: string): string {
    const { decimalSeparator, thousandsSeparator } = this.options as CurrencyOptions;
    const regex = `(\\d)(?=(\\d{3})+(\\${decimalSeparator}|$))`;

    return formattedValue.replace(new RegExp(regex, 'g'), `$1${thousandsSeparator}`);
  }

  /**
   * Adds currency symbol to the formatted value if its needed.
   *
   * @param formattedValue - The formatted value.
   * @returns The formatted value with or without the currency symbol.
   *
   * @public
   */
  private addCurrencySymbolIfNeeded(formattedValue: string): string {
    return this.options?.symbol ? this.addCurrencySymbol(formattedValue) : formattedValue;
  }

  /**
   * Adds currency symbol to the formatted value.
   *
   * @param formattedValue - The formatted value.
   * @returns The formatted value with the currency symbol.
   *
   * @public
   */
  private addCurrencySymbol(formattedValue: string): string {
    const { symbol, currencyLocation, currencySpacing } = this.options as CurrencyOptions;
    const currencySpacingCharacter = currencySpacing ? ' ' : '';
    if (currencyLocation === 'prepend') {
      return `${symbol}${currencySpacingCharacter}${formattedValue}`;
    } else if (currencyLocation === 'append') {
      return `${formattedValue}${currencySpacingCharacter}${symbol}`;
    }
    //TODO Add logger to show a warning message
    return formattedValue;
  }
}
export default new CurrencyFormatter();
