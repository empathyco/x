import { Result } from '@empathy/search-types';
import { ResultSchema } from '@empathy/search-types/schemas';
import { SearchByIdSimpleResponse } from '../../__fixtures__/responses/search-by-id.response';
import { adapter } from '../../__mocks__/adapter.mocks';
import { getFetchMock } from '../../__mocks__/fetch.mock';

it('searches results by id successfully', async () => {
  window.fetch = jest.fn(getFetchMock(SearchByIdSimpleResponse));
  const query = '1236';

  const response = await adapter.searchById({ query: query, origin: 'Does not matter' });

  expect(response.results).everyItemToMatch(ResultSchema);
  expect(response.results).toHaveLength(SearchByIdSimpleResponse.content.docs.length);
  expectEveryResultToHaveSkuHtmlPropertyWithQueryHighlighted(response.results, query);
});

function expectEveryResultToHaveSkuHtmlPropertyWithQueryHighlighted(results: Result[], query: string) {
  const regexp = new RegExp(`<strong class="ebx-result-identifier__query">${ query }<\/strong>`, 'i');
  results.forEach(result => expect(result.identifier.html).toMatch(regexp));
}
