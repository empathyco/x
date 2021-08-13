import { NextQuerySchema } from '@empathyco/x-types/schemas';
import { NextQueriesSimpleResponse } from '../../__fixtures__/responses/next-queries.response';
import { adapter } from '../../__mocks__/adapter.mocks';
import { getFetchMock } from '../../__mocks__/fetch.mock';

beforeEach(jest.clearAllMocks);

it('gets next queries successfully', async () => {
  window.fetch = jest.fn(getFetchMock(NextQueriesSimpleResponse));

  const response = await adapter.getNextQueries({ query: 'lego' });

  expect(response.nextQueries).toHaveLength(NextQueriesSimpleResponse.length);
  expect(response.nextQueries).everyItemToMatch(NextQuerySchema);
});
