import { Suggestion } from '@empathy/search-types';
import { FacetSchema, FilterSchema, SuggestionSchema } from '@empathy/search-types/schemas';
import { SuggestionsWithLegoQuery } from '../../__fixtures__/responses/suggestions-with-query.response';
import { SuggestionsWithoutQuery } from '../../__fixtures__/responses/suggestions-without-query.response';
import { adapter } from '../../__mocks__/adapter.mocks';
import { getFetchMock } from '../../__mocks__/fetch.mock';

beforeEach(jest.clearAllMocks);

it('gets suggestions without query successfully', async () => {
  window.fetch = jest.fn(getFetchMock(SuggestionsWithoutQuery));

  const response = await adapter.getSuggestions({});

  expect(response.suggestions.length).toBeGreaterThanOrEqual(SuggestionsWithoutQuery.topTrends.length);
  expectSuggestionsToMatchSchema(response.suggestions);
});

it('gets suggestions with query successfully', async () => {
  window.fetch = jest.fn(getFetchMock(SuggestionsWithLegoQuery));

  const response = await adapter.getSuggestions({ query: 'lego' });

  expect(response.suggestions.length).toBeGreaterThanOrEqual(SuggestionsWithLegoQuery.topTrends.length);
  expectSuggestionsToMatchSchema(response.suggestions);
  expectEverySuggestionToHaveHtmlPropertyWithQueryHighlighted(response.suggestions, 'lego');
});

function expectSuggestionsToMatchSchema(suggestions: Suggestion[]) {
  expect(suggestions).everyItemToMatch(SuggestionSchema);
  suggestions.forEach(suggestion => suggestion.facets.forEach(facet => {
    expect(facet).toMatchObject(FacetSchema);
    expect(facet.filters).everyItemToMatch(FilterSchema);
  }));
}

function expectEverySuggestionToHaveHtmlPropertyWithQueryHighlighted(suggestions: Suggestion[], query: string) {
  const regexp = new RegExp(`<strong class="ebx-suggestion__query">${ query }<\/strong>`, 'i');
  suggestions.forEach(suggestion => expect(suggestion.html).toMatch(regexp));
}
