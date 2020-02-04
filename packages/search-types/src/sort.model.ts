/**
 * @public
 * The sort model represents a single sort value. It includes the value which will be sent to the API,
 * the message key and the sorting direction
 */
export interface Sort {
  direction: SortDirection | null;
  title: string;
  value: string;
}

/**
 * @public
 * The direction of the sorting, ascending or descending
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}
