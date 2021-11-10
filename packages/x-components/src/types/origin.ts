import { WireMetadata } from '../wiring/wiring.types';

/**
 * Information to track the usefulness of the query in relation to the {@link QueryFeature} that
 * generated it, and the {@link Location} where it has been shown to the user.
 *
 * @public
 */
export type QueryOrigin = `${QueryFeature}:${Location}`;
/**
 * Information to track the usefulness of a result in relation to the {@link ResultFeature} that
 * generated it, and the {@link Location} where it has been shown to the user.
 *
 * @public
 */
export type ResultOrigin = `${ResultFeature}:${Location}`;

/**
 * The name of the tool that generated the query.
 *
 * @public
 */
export type QueryFeature =
  | 'search_box'
  | 'url'
  | 'query_suggestion'
  | 'next_query'
  | 'popular_search'
  | 'history_query'
  | 'partial_result'
  | 'related_tag'
  | 'spellcheck';

/**
 * The name of the tool that generated the results.
 *
 * @public
 */
export type ResultFeature =
  | 'search'
  | 'recommendations'
  | 'next_query_results'
  | 'partial_results'
  | 'identifier_result';

/**
 * Indicates where the feature is placed.
 *
 * @example A `next_query`
 * {@link QueryFeature} may be located in the `predictive_layer`, or in the `results` grid.
 *
 * @example A `recommendations`
 * {@link ResultFeature} may be located in `no_results`, `no_query`, or `predictive_layer`.
 *
 * @public
 */
export type Location =
  | 'external'
  | 'no_query'
  | 'no_results'
  | 'predictive_layer'
  | 'results'
  | 'pdp'
  | 'url_history'
  | 'url_history_pdp';

/**
 * Parameters to create a {@link QueryOrigin} or {@link ResultOrigin}.
 */
export type QueryOriginInit = Partial<Pick<WireMetadata, 'feature' | 'location'>>;

/**
 * Creates a {@link QueryOrigin} or a {@link ResultOrigin} string given a {@link QueryFeature} and
 * a {@link Location}.
 * If it can't be created, it returns `undefined`.
 *
 * @param originInit - An object containing the needed properties to create a {@link QueryOrigin} or
 * a {@link ResultOrigin}.
 * @returns The composed origin, or `undefined` if it is not able to create the origin.
 * @internal
 */
export function createOrigin({
  feature,
  location
}: QueryOriginInit): QueryOrigin | ResultOrigin | null {
  if (location && feature) {
    return `${feature}:${location}`;
  }
  return null;
}
