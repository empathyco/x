import { SimpleFilter } from '@empathy/search-types';

/**
 * Creates {@link @empathy/search-types#SimpleFilter | SimpleFilter} stub.
 *
 * @param filter - A partial filter to override certain properties. Useful for testing.
 * @returns A Simple filter.
 *
 * @internal
 */
export function getSimpleFilterStub(filter: Partial<SimpleFilter> = {}): SimpleFilter {
  return Object.assign<SimpleFilter, Partial<SimpleFilter>>(
    // TODO Update with @empathy/search-types@6.0.0 changes.
    {
      id: 'category:test',
      modelName: 'SimpleFilter',
      selected: false,
      callbackInfo: {},
      title: 'Test',
      parent: null,
      value: { filter: 'category:tes' },
      count: 0,
      children: [],
      facet: null as any
    },
    filter
  );
}
