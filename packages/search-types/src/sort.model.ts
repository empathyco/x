/**
 * The sort model represents a single sort value. It includes the value which will be sent to
 * the API, the message key and the sorting direction.
 *
 * @public
 */
export interface Sort {
  /** {@link SortDirection | sort direction} or null if it doesn't have. */
  direction: SortDirection | null;
  /** Sort title. */
  title: string;
  /** Sort value. */
  value: string;
}

/**
 * The direction of the sorting, ascending or descending.
 *
 * @public
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}
