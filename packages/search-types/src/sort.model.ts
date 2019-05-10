export interface Sort {
  direction: SortDirection;
  title: string;
  value: string;
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}
