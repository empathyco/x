import { NamedModel } from '../named-model.model';
import { Facet } from './facet.model';
import { FilterValue, RangeFilterValue, SimpleFilterValue } from './filter-value.model';

export interface Filter extends NamedModel {
  children?: this[];
  count: number;
  entityDetected?: boolean;
  facet: Facet;
  id: string;
  needsParentFilter?: boolean;
  parent?: this;
  selected: boolean;
  value: FilterValue;
  title: string;
  callbackInfo?: any;
}

export interface SimpleFilter extends Filter {
  value: SimpleFilterValue;
}

export interface RangeFilter extends Filter {
  value: RangeFilterValue;
}

export enum FilterModel {
  simple = 'SimpleFilter',
  range = 'RangeFilter',
  currencyRange = 'CurrencyRangeFilter',
}
