import { adapter, BASE_TEST_CONFIG } from '../../__mocks__/adapter.mocks';
import { koFetchMock, okFetchMock } from '../../__mocks__/fetch.mock';

const baseRequest = { start: 0, rows: 24, origin: 'test', query: 'lego' };

beforeEach(() => {
  window.fetch = okFetchMock as any;
  jest.clearAllMocks();
  localStorage.clear();
});

it('raises abort errors when you make two immediate calls to the same method providing no requestID', async () => {
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
  await adapter.search(baseRequest).catch(error => expect(error).toBeDefined());
});

it('allows to disable cache from outside the adapter', async () => {
  // Ensure cache is configured for this feature
  adapter.setConfig({ features: { search: { cacheTTLInMinutes: 5 } } });
  await adapter.search(baseRequest, { requestId: 'A', ttlInMinutes: 0 });
  await adapter.search(baseRequest, { requestId: 'B' });
  expect(window.fetch).toHaveBeenCalledTimes(2);
  // Restore base configuration
  adapter.setConfig(BASE_TEST_CONFIG);
});

it('allows to override cache ttl from outside the adapter', async () => {
  const startingTimestamp = 1564564336766;
  Date.now = jest.fn(() => startingTimestamp);
  await adapter.search(baseRequest, { requestId: 'A', ttlInMinutes: 1 });
  await adapter.search(baseRequest, { requestId: 'B' });
  expect(window.fetch).toHaveBeenCalledTimes(1);
  Date.now = jest.fn(() => startingTimestamp + 2 * 60 * 1000);
  await adapter.search(baseRequest, { requestId: 'C' });
  expect(window.fetch).toHaveBeenCalledTimes(2);
});

it('uses configured cache if ttl is not provided', async () => {
  // Ensure cache is configured for this feature
  adapter.setConfig({ features: { search: { cacheTTLInMinutes: 5 } } });
  await adapter.search(baseRequest, { requestId: 'A' });
  await adapter.search(baseRequest, { requestId: 'B' });
  expect(window.fetch).toHaveBeenCalledTimes(1);
  // Restore base configuration
  adapter.setConfig(BASE_TEST_CONFIG);
});

it('invalidates the cache', async () => {
  await adapter.search(baseRequest, { requestId: 'A', ttlInMinutes: 1 });
  adapter.invalidateCache();
  await adapter.search(baseRequest, { requestId: 'B' });
  expect(window.fetch).toHaveBeenCalledTimes(2);
});
