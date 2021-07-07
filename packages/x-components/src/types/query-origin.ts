/**
 * Union type containing all the origin possible values for query origin.
 *
 * @public
 */
export type QueryOrigin =
  | 'back_from_search'
  | 'back_from_pdp'
  | 'default'
  | 'discovery_wall'
  | 'empathize_category'
  | 'empathize_next_queries'
  | 'empathize_recommendations'
  | 'empathize_reference'
  | 'empathize_term'
  | 'empathize_trending'
  | 'empty_search'
  | 'history'
  | 'linked'
  | 'next_query'
  | 'next_query_grid'
  | 'no_results'
  | 'partial'
  | 'related_tag'
  | 'spellcheck';
