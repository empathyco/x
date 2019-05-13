export interface Sort {
  direction: SortDirection | null;
  title: string;
  value: string;
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}
