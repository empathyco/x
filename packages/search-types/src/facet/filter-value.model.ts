export interface FilterValue {
  readonly filter: string;
}

export interface RangeFilterValue extends FilterValue {
  min: number;
  max: number;
}

export interface SimpleFilterValue extends FilterValue {
  value: string;
}
