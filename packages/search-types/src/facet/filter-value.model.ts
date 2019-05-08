export interface FilterValue {
  readonly filter: string;
}

export interface RangeFilterValue extends FilterValue {
  min: number | null;
  max: number | null;
}

export interface SimpleFilterValue extends FilterValue {
  value: string;
}
