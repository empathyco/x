import { koFetchMock, okFetchMock } from '../__mocks__/fetch.mock';
import { FetchHttpClient } from '../http-clients/fetch-http-client';
import { HttpClient } from '../http-clients/http-client.types';

let httpClient: HttpClient;

beforeEach(() => {
  httpClient = new FetchHttpClient();
  jest.clearAllMocks();
});

it('creates well formed and valid URLs', async () => {
  window.fetch = okFetchMock as any;

  await httpClient.get('https://api.empathy.co/search', {
    q: 'shirt',
    filter: ['long sleeve', 'dotted', 'white'],
    rows: 12
  });

  expectFetchToBeCalledWithUrl('https://api.empathy.co/search?q=shirt&filter=long+sleeve&filter=dotted&filter=white&rows=12');
});

it('allows URLs which already have parameters', async () => {
  window.fetch = okFetchMock as any;

  await httpClient.get('https://api.empathy.co/search?additionalParam=true', {
    q: 'shirt'
  });

  expectFetchToBeCalledWithUrl('https://api.empathy.co/search?additionalParam=true&q=shirt');
});

it('does not map undefined values', async () => {
  window.fetch = okFetchMock as any;

  await httpClient.get('https://api.empathy.co/search', {
    q: undefined
  });

  expectFetchToBeCalledWithUrl('https://api.empathy.co/search');
});

it('cancels equal endpoint requests if no requestId parameter is passed', async () => {
  expect.hasAssertions();
  window.fetch = okFetchMock as any;
  const searchUrl = 'https://api.empathy.co/search';

  await Promise.all([
    httpClient.get(searchUrl, { q: 'shirt' })
      .catch(error => expect(error.code).toEqual(DOMException.ABORT_ERR)),
    httpClient.get(searchUrl, { q: 'jeans' })
      .then(response => expect(response).toBeDefined())
  ]);
});

it('does not cancel equal endpoint requests if requestId parameter is passed', async () => {
  expect.hasAssertions();
  window.fetch = okFetchMock as any;
  const searchUrl = 'https://api.empathy.co/search?additionalParam=true';
  const empathizeUrl = 'https://api.empathy.co/empathize?additionalParam=true';

  await Promise.all([
    httpClient.get(searchUrl, { q: 'shirt' }, { requestId: 'search' })
      .catch(error => expect(error.code).toEqual(DOMException.ABORT_ERR)),
    httpClient.get(empathizeUrl, { q: 'shirt' }, { requestId: 'search' })
      .then(response => expect(response).toBeDefined()),
    httpClient.get(searchUrl, { q: 'jeans' })
      .then(response => expect(response).toBeDefined())
  ]);
});

it('throws an exception if the response status is not OK', async () => {
  expect.assertions(1);
  window.fetch = koFetchMock as any;
  const searchUrl = 'https://api.empathy.co/search';
  await httpClient.get(searchUrl, { q: 'jeans' })
    .catch(error => expect(error.response.ok).toBeFalsy());
});

function expectFetchToBeCalledWithUrl(url: string): void {
  expect((window.fetch as jest.Mock).mock.calls[0][0]).toEqual(url);
}
