import { BannerSchema, PromotedSchema, RedirectionSchema, ResultSchema, TaggingSchema } from '@empathyco/x-types/schemas';
import { FacetSchema } from '@empathyco/x-types-next/schemas';
import { SearchResponse } from '../../../types';
import { SearchWithPartialsResponse } from '../../__fixtures__/responses/search-with-partials.response';
import { SearchSimpleResponse } from '../../__fixtures__/responses/search.response';
import { SpellcheckedResponse } from '../../__fixtures__/responses/spellchecked-search.response';
import { adapter } from '../../__mocks__/adapter.mocks';
import { getFetchMock } from '../../__mocks__/fetch.mock';

const baseRequest = { start: 0, rows: 24, origin: 'test', query: 'lego' };

beforeEach(jest.clearAllMocks);

it('searches successfully', async () => {
  const fetchMock = jest.fn(getFetchMock(SearchSimpleResponse));
  window.fetch = fetchMock as any;

  const response = await adapter.search(baseRequest);

  expect(response.totalResults).toEqual(SearchSimpleResponse.content.numFound);
  expect(response).not.toHaveProperty('spellcheck');
  expect(response.queryTagging).toMatchObject(TaggingSchema);
  expect(response.results).everyItemToMatch(ResultSchema);
  expect(response.results.length).toBeGreaterThan(0);
  expect(response.results).toHaveLength(SearchSimpleResponse.content.docs.length);
  expect(response.facets).everyItemToMatch(FacetSchema);
  expect(response.facets?.length).toBeGreaterThan(0);
  expect(response.facets).toHaveLength(SearchSimpleResponse.content.facets.length);
  expect(fetchMock.mock.calls[0][0]).toContain('q=lego');
  expect(fetchMock.mock.calls[0][0]).toContain('origin=test');
  expect(fetchMock.mock.calls[0][0]).toContain('start=0');
  expect(fetchMock.mock.calls[0][0]).toContain('rows=24');
});

it('searches partials successfully', async () => {
  window.fetch = jest.fn(getFetchMock(SearchWithPartialsResponse));

  const response = await adapter.search(baseRequest);

  expect(response.partialResults.length).toBeGreaterThan(0);
  expect(response.partialResults).toHaveLength(SearchWithPartialsResponse.content.suggestions.length);
  expectEveryPartialResultToMatchSchema(response);
});

it('search maps spellcheck successfully', async () => {
  window.fetch = jest.fn(getFetchMock(SpellcheckedResponse));

  const response = await adapter.search(baseRequest);

  expect(response.spellcheck).toEqual(SpellcheckedResponse.content.spellchecked);
});

it('search maps banners successfully', async () => {
  window.fetch = jest.fn(getFetchMock(SearchSimpleResponse));

  const response = await adapter.search(baseRequest);
  expect(response.banners).toHaveLength(SearchSimpleResponse.banner.length);
  expect(response.banners).everyItemToMatch(BannerSchema);
});
it('search maps promoteds successfully', async () => {
  window.fetch = jest.fn(getFetchMock(SearchSimpleResponse));

  const response = await adapter.search(baseRequest);
  expect(response.promoteds).toHaveLength(SearchSimpleResponse.promoted.length);
  expect(response.promoteds).everyItemToMatch(PromotedSchema);
});
it('search maps redirections successfully', async () => {
  window.fetch = jest.fn(getFetchMock(SearchSimpleResponse));

  const response = await adapter.search(baseRequest);
  expect(response.redirections).toHaveLength(SearchSimpleResponse.direct.length);
  expect(response.redirections).everyItemToMatch(RedirectionSchema);
});

function expectEveryPartialResultToMatchSchema(response: SearchResponse) {
  Object.values(response.partialResults).forEach(partial => {
    expect(partial.results).everyItemToMatch(ResultSchema);
  });
}
