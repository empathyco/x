import { NamedModel } from '../named-model.model';
import { Facet } from './facet.model';

/**
 * @public
 * A concrete value of a facet, which is used to sift the results
 * @param ValueType - The value property type. Defaults to any
 */
export interface Filter<ValueType = any> extends NamedModel {
  callbackInfo: Record<string, any>;
  children: this[];
  count: number;
  facet: Facet;
  id: string;
  parent: this | null;
  selected: boolean;
  title: string;
  value: ValueType;
}

/**
 * @public
 * An alias of Filter<SimpleValue>
 */
export type SimpleFilter = Filter<SimpleValue>;
/**
 * @public
 * An alias of Filter<RangeValue>
 */
export type RangeFilter = Filter<RangeValue>;

/**
 * @public
 * An enum to ease the differentiation of the multiple filter types
 */
export enum FilterModel {
  simple = 'SimpleFilter',
  range = 'RangeFilter',
  currencyRange = 'CurrencyRangeFilter',
}

/**
 * @public
 * A numeric range filter value
 */
export interface RangeValue {
  /**
   * The minimum value allowed. `null` means unset
   */
  min: number | null;
  /**
   * The maximum value allowed. `null` means unset
   */
  max: number | null;
}

/**
 * @public
 * A simple filter value
 */
export interface SimpleValue {
  filter: string;
}
