import { adapter } from '../../__mocks__/adapter.mocks';
import { koFetchMock, okFetchMock } from '../../__mocks__/fetch.mock';

const baseRequest = { start: 0, rows: 24, origin: 'test', query: 'lego' };

beforeEach(jest.clearAllMocks);

it('raises abort errors when you make two immediate calls to the same method providing no requestID', async () => {
  window.fetch = okFetchMock as any;

  await Promise.all([
    adapter.search(Object.assign({}, baseRequest, { query: 'lego' }))
      .catch(error => expect(error.code).toEqual(DOMException.ABORT_ERR)),
    adapter.search(Object.assign({}, baseRequest, { query: 'barbie' }))
      .then(response => expect(response).toBeDefined())
  ]);

  expect(okFetchMock).toHaveBeenCalledTimes(2);
  expect(okFetchMock.mock.calls[0][0]).toContain('q=lego');
  expect(okFetchMock.mock.calls[1][0]).toContain('q=barbie');
});

it('raises response errors', async () => {
  window.fetch = koFetchMock as any;

  await adapter.search(baseRequest)
    .catch(error => expect(error).toBeDefined());
});
