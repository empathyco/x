import { RecommendationSchema } from '@empathyco/x-types/schemas';
import { RecommendationsSimpleResponse } from '../../__fixtures__/responses/recommendations.response';
import { adapter } from '../../__mocks__/adapter.mocks';
import { getFetchMock, okFetchMock } from '../../__mocks__/fetch.mock';

const baseRequest = { start: 0, rows: 24, origin: 'no_results', query: 'test' };

beforeEach(jest.clearAllMocks);

it('gets result recommendations successfully', async () => {
  window.fetch = jest.fn(getFetchMock(RecommendationsSimpleResponse));

  const response = await adapter.getTopRecommendations(baseRequest);

  // Recommendations are the same as results, but without the query tagging
  expect(response.results).toHaveLength(RecommendationsSimpleResponse.topclicked.docs.length);
  expect(response.results).everyItemToMatch(RecommendationSchema);
});

it('adds the query to recommendations', async () => {
  window.fetch = okFetchMock as any;

  await adapter.getTopRecommendations(baseRequest);

  expect(okFetchMock.mock.calls[0][0]).toContain('q=test');
});

it('DOES NOT add the query to recommendations when it is undefined/not passed', async () => {
  window.fetch = okFetchMock as any;
  const { origin } = baseRequest;

  // Origin is the only required field
  await adapter.getTopRecommendations({ origin, query: undefined });
  await adapter.getTopRecommendations({ origin });

  expect(okFetchMock.mock.calls[0][0]).not.toContain('q=');
  expect(okFetchMock.mock.calls[1][0]).not.toContain('q=');
});
