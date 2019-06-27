export interface EmpathyFacet {
  facet: string;
  values: EmpathyFilter[];
}

export interface EmpathyFilter {
  count: number;
  filter: string;
  selected?: boolean;
  value: string;
  values?: EmpathyFilter[];
}
