import { RelatedTag } from '@empathyco/x-types';

/**
 * Query state type, containing a property to hold the current query of the module.
 *
 * @public
 */
export interface QueryState {
  /** The query of the module. Different modules may have queries that differ in value
   * or time. */
  query: string;
}

/**
 * The {@link QueryState} mutations.
 *
 * @public
 */
export interface QueryMutations {
  /**
   * Sets the query.
   *
   * @param query - The new query.
   */
  setQuery(query: string): void;
}

/**
 * Options to create a getter that combines the query with the selected related tags.
 *
 * @public
 */
export interface CreateRelatedTagsQueryGetterOptions<State, Getters> {
  /**
   * Retrieves the selected related tags of the module.
   *
   * @param state - The state of the module.
   * @param getters - The getters of the module.
   * @returns The list of selected related tags.
   */
  getRelatedTags: (state: State, getters: Getters) => RelatedTag[];
}

/**
 * Sets the query of the module.
 *
 * @param state - State of the module.
 * @param query - The new query to set.
 * @public
 */
export function setQuery(state: QueryState, query: string): void {
  state.query = query;
}

/**
 * Creates a getter that combines the current selected related tags and the query of the module.
 *
 * @param options - Options on how the getter should behave.
 * @returns A getter that combines the selected related tags with the query.
 * @public
 */
export function createRelatedTagsQueryGetter<State extends QueryState, Getters>({
  getRelatedTags
}: CreateRelatedTagsQueryGetterOptions<State, Getters>): (
  state: State,
  getters: Getters
) => string {
  return function relatedTagsQuery(state, getters) {
    const query = state.query.trim();
    return query ? getRelatedTags(state, getters).reduce(concatRelatedTag, query).trim() : '';
  };
}

/**
 * Joins a query and a related tag respecting the tag position.
 *
 * @param partialQuery - The query to concatenate the related tag with.
 * @param relatedTag - The related tag to concatenate.
 * @returns The query and the related tag joined.
 * @internal
 */
function concatRelatedTag(
  partialQuery: string,
  { tag, query: relatedTagQuery }: RelatedTag
): string {
  return relatedTagQuery.startsWith(tag) ? `${tag} ${partialQuery}` : `${partialQuery} ${tag}`;
}
