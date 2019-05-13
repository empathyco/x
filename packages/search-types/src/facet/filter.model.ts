import { NamedModel } from '../named-model.model';
import { Facet } from './facet.model';

export interface Filter<ValueType = SimpleValue> extends NamedModel {
  callbackInfo: Record<string, any>;
  children: this[];
  count: number;
  entityDetected: boolean;
  facet: Facet;
  id: string;
  needsParentFilter: boolean;
  parent: this | null;
  selected: boolean;
  title: string;
  value: ValueType;
}

export type SimpleFilter = Filter<SimpleValue>;
export type RangeFilter = Filter<RangeValue>;

export enum FilterModel {
  simple = 'SimpleFilter',
  range = 'RangeFilter',
  currencyRange = 'CurrencyRangeFilter',
}

export interface RangeValue {
  min: number | null;
  max: number | null;
}

export type SimpleValue = string;
