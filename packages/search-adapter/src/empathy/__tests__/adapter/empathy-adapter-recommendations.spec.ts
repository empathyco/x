import { RecommendationSchema } from '@empathy/search-types/schemas';
import { RecommendationsSimpleResponse } from '../../__fixtures__/responses/recommendations.response';
import { adapter } from '../../__mocks__/adapter.mocks';
import { getFetchMock } from '../../__mocks__/fetch.mock';

beforeEach(jest.clearAllMocks);

it('gets result recommendations successfully', async () => {
  window.fetch = jest.fn(getFetchMock(RecommendationsSimpleResponse));

  const response = await adapter.getRecommendations({ start: 0, rows: 24, origin: 'test', query: 'test' });

  // Recommendations are the same as results, but without the query tagging
  expect(response.results).toHaveLength(RecommendationsSimpleResponse.topclicked.docs.length);
  expect(response.results).everyItemToMatch(RecommendationSchema);
});
