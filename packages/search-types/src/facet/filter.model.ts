import { CallbackInfo } from '../callback-info.model';
import { NamedModel } from '../named-model.model';
import { Facet } from './facet.model';

/**
 * A concrete value of a facet, which is used to sift the results.
 *
 * @param ValueType - The value property type. Defaults to any.
 *
 * @public
 */
export interface Filter<ValueType = any> extends NamedModel, CallbackInfo {
  /** Descendants filters. */
  children: this[];
  /* Number of items for the filter. */
  count: number;
  /** Facet parent. */
  facet: Facet;
  /** An unique ID that identifies the filter. */
  id: string;
  /** Filter parent or null it doesn't have. */
  parent: this | null;
  /** Flag if the filter is selected or not. */
  selected: boolean;
  /** Filter name. */
  title: string;
  /** Filter value with the `ValueType` type. */
  value: ValueType;
}

/**
 * An alias of `Filter<SimpleValue>`.
 *
 * @public
 */
export type SimpleFilter = Filter<SimpleValue>;

/**
 * An alias of `Filter<RangeValue>`.
 *
 * @public
 */
export type RangeFilter = Filter<RangeValue>;

/**
 * An enum to ease the differentiation of the multiple filter types.
 *
 * @public
 */
export enum FilterModel {
  simple = 'SimpleFilter',
  range = 'RangeFilter',
  currencyRange = 'CurrencyRangeFilter',
}

/**
 * A numeric range filter value.
 *
 * @public
 */
export interface RangeValue {
  /** The minimum value allowed. `null` means unset. */
  min: number | null;
  /** The maximum value allowed. `null` means unset. */
  max: number | null;
}

/**
 * A simple filter value.
 *
 * @public
 */
export interface SimpleValue {
  /** Filter value. */
  filter: string;
}
