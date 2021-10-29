/**
 * Information to track the uselfuness of the query in relation to the {@link Feature} that
 * generated it, and the {@link FeatureLocation} where it has been shown to the user.
 *
 * @public
 */
export type Origin = `${Feature}:${FeatureLocation}`;

/**
 * Indicates where the feature that generated the query is located. For example, the `next_query`
 * feature may be located in the `predictive_layer`, or in the `results` grid.
 *
 * @public
 */
export type FeatureLocation =
  | 'external'
  | 'url_history_pdp'
  | 'url_history'
  | 'predictive_layer'
  | 'no_query'
  | 'results'
  | 'no_results'
  | 'partial_results';

/**
 * The tool that generated a query.
 *
 * @public
 */
export type Feature = QueryFeature | ClickFeature;

/**
 * The name of the feature that the query comes from.
 *
 * @public
 */
export type QueryFeature =
  | 'search_box'
  | 'linked'
  | 'query_suggestion'
  | 'query_suggestion_with_facet'
  | 'next_query'
  | 'popular_search'
  | 'history_query'
  | 'partial_result'
  | 'related_tag'
  | 'spellcheck';

/**
 * The name of the feature that the click event comes from.
 *
 * @public
 */
export type ClickFeature = 'recommendation' | 'identifier_result' | 'discovery_wall';
