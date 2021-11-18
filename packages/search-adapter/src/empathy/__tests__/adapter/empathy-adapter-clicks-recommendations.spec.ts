import { RecommendationSchema, TaggingInfoSchema } from '@empathyco/x-types/schemas';
import { DiscoveryWallRecommendationsResponse } from '../../__fixtures__/responses/discovery-wall-recommendations.response';
import { adapter } from '../../__mocks__/adapter.mocks';
import { getFetchMock } from '../../__mocks__/fetch.mock';

const baseRequest = {
  origin: 'no_results',
  section: 'Woman',
  rows: 12,
  start: 0,
  productIds: ['1', '2', '3'],
  userType: 'new',
  user: '12345',
  session: '67890'
};

beforeEach(jest.clearAllMocks);

it('gets result recommendations filtered by clicks', async () => {
  const fetchMock = jest.fn(getFetchMock(DiscoveryWallRecommendationsResponse));
  window.fetch = fetchMock as any;

  const response = await adapter.getClicksRecommendations(baseRequest);

  expect(fetchMock.mock.calls[0][0]).toBeAValidURLWithQueryParameters({
    origin: baseRequest.origin,
    section: baseRequest.section,
    rows: baseRequest.rows.toString(),
    start: baseRequest.start.toString(),
    productId: baseRequest.productIds,
    user: baseRequest.user,
    session: baseRequest.session
  });
  expect(response.results).toHaveLength(DiscoveryWallRecommendationsResponse.docs.length);
  expect(response.results).everyItemToMatch(RecommendationSchema);
  expect(response.totalResults).toEqual(DiscoveryWallRecommendationsResponse.numFound);
  expect(response.showTagging).toEqual(TaggingInfoSchema);
});
