/**
 * @public
 * A related tag is just a term that refines the current query
 */
export interface RelatedTag {
  /**
   * The full new query, concatenating the `tag` and the `previous` properties
   */
  query: string;
  /**
   * The term to add to the current query
   */
  tag: string;
  /**
   * If selection mode is enabled, tells if this related tag is selected or not
   */
  selected: boolean;
  /**
   * The query to refine
   */
  previous: string;
}
