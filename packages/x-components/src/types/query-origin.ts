/**
 * Information to track the usefulness of the query in relation to the {@link QueryFeature} that
 * generated it, and the {@link QueryLocation} where it has been shown to the user.
 *
 * @public
 */
export type QueryOrigin = `${QueryFeature}:${QueryLocation}`;

/**
 * The name of the tool that generated the query.
 *
 * @public
 */
export type QueryFeature =
  | 'search_box'
  | 'url'
  | 'query_suggestion'
  | 'query_suggestion_with_facet'
  | 'next_query'
  | 'popular_search'
  | 'history_query'
  | 'partial_result'
  | 'related_tag'
  | 'spellcheck';

/**
 * Indicates where the feature that generated the query is located. For example, the `next_query`
 * feature may be located in the `predictive_layer`, or in the `results` grid.
 *
 * @public
 */
export type QueryLocation =
  | 'external'
  | 'url_history_pdp'
  | 'url_history'
  | 'predictive_layer'
  | 'results';
