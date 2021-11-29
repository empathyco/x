import { BrowserStorageService } from '@empathyco/x-storage-service';
import { getFetchMock, koFetchMock, okFetchMock } from '../__mocks__/fetch.mock';
import { FetchHttpClient } from '../http-clients/fetch-http-client';
import { EmpathyCacheService } from '../services/empathy-cache.service';

const cache = new EmpathyCacheService(new BrowserStorageService(localStorage, 'empathy-cache'));
const httpClient = new FetchHttpClient(cache);
const endpoint = 'https://api.empathy.co/search';

beforeEach(() => {
  window.fetch = okFetchMock as any;
  jest.clearAllMocks();
  cache.clear();
});

it('creates well formed and valid URLs', async () => {
  await httpClient.get(endpoint, {
    q: 'shirt',
    filter: ['long sleeve', 'dotted', 'white'],
    rows: 12
  });
  expectFetchToBeCalledWithUrl(
    `${endpoint}?q=shirt&filter=long+sleeve&filter=dotted&filter=white&rows=12`
  );
});

it('allows URLs which already have parameters', async () => {
  await httpClient.get(`${endpoint}?additionalParam=true`, { q: 'shirt' });
  expectFetchToBeCalledWithUrl(`${endpoint}?additionalParam=true&q=shirt`);
});

it('does not map undefined values', async () => {
  await httpClient.get(endpoint, { q: undefined });
  expectFetchToBeCalledWithUrl(endpoint);
});

it('cancels equal endpoint requests if no requestId parameter is passed', async () => {
  expect.hasAssertions();
  await Promise.all([
    httpClient
      .get(endpoint, { q: 'shirt' })
      .catch(error => expect(error.code).toEqual(DOMException.ABORT_ERR)),
    httpClient.get(endpoint, { q: 'jeans' }).then(response => expect(response).toBeDefined())
  ]);
});

it('does not cancel equal endpoint requests if requestId parameter is passed', async () => {
  expect.hasAssertions();
  const searchUrl = `${endpoint}?additionalParam=true`;
  const empathizeUrl = 'https://api.empathy.co/empathize?additionalParam=true';
  await Promise.all([
    httpClient
      .get(searchUrl, { q: 'shirt' }, { requestId: 'search' })
      .catch(error => expect(error.code).toEqual(DOMException.ABORT_ERR)),
    httpClient
      .get(empathizeUrl, { q: 'shirt' }, { requestId: 'search' })
      .then(response => expect(response).toBeDefined()),
    httpClient.get(searchUrl, { q: 'jeans' }).then(response => expect(response).toBeDefined())
  ]);
});

it('throws an exception if the response status is not OK', async () => {
  expect.assertions(1);
  window.fetch = koFetchMock as any;
  await httpClient
    .get(endpoint, { q: 'jeans' })
    .catch(error => expect(error.response.ok).toBeFalsy());
});

it('caches requests if ttlInMinutes parameter is greater than 0', async () => {
  await httpClient.get(endpoint, { q: 'shirt' }, { ttlInMinutes: 1 });
  expect(window.fetch).toHaveBeenCalled();
  expect(localStorage).toHaveLength(1);
});

it('does not cache requests if ttlInMinutes parameter is 0', async () => {
  await httpClient.get(endpoint, { q: 'shirt' }, { ttlInMinutes: 0 });
  expect(window.fetch).toHaveBeenCalled();
  expect(localStorage).toHaveLength(0);
});

it('returns cached requests before their expiration', async () => {
  window.fetch = jest.fn(getFetchMock({ response: 'test' }));
  const firstResponse = await httpClient.get(
    endpoint,
    { q: 'shirt' },
    { requestId: 'A', ttlInMinutes: 1 }
  );
  const secondResponse = await httpClient.get(endpoint, { q: 'shirt' }, { requestId: 'B' });
  expect(secondResponse).toEqual(firstResponse);
  expect(window.fetch).toHaveBeenCalledTimes(1);
});

it('does not return cached requests after their expiration', async () => {
  const startingTimestamp = 1564564336766;
  Date.now = jest.fn(() => startingTimestamp);
  await httpClient.get(endpoint, { q: 'shirt' }, { requestId: 'A', ttlInMinutes: 1 });
  Date.now = jest.fn(() => startingTimestamp + 2 * 60 * 1000);
  await httpClient.get(endpoint, { q: 'shirt' }, { requestId: 'B' });
  expect(window.fetch).toHaveBeenCalledTimes(2);
});

it('allows to pass headers to the request', () => {
  const headers = { instance: 'A1B1' };
  httpClient.get(endpoint, {}, { headers });

  expect(window.fetch).toBeCalledWith(endpoint, { headers, signal: expect.anything() });
});

function expectFetchToBeCalledWithUrl(url: string): void {
  expect((window.fetch as jest.Mock).mock.calls[0][0]).toEqual(url);
}
