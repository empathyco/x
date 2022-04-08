import { koFetchMock, okFetchMock } from '../__mocks__/fetch.mock';
import { fetchHttpClient } from '../fetch.http-client';

describe('fetch httpClient testing', () => {
  const endpoint = 'https://api.empathy.co/search';

  beforeEach(() => {
    window.fetch = okFetchMock as any;
    jest.clearAllMocks();
  });

  it('creates well formed and valid URLs', async () => {
    await fetchHttpClient(endpoint, {
      parameters: {
        q: 'shirt',
        filter: ['long sleeve', 'dotted', 'white'],
        rows: 12
      }
    });
    expectFetchCall(`${endpoint}?q=shirt&filter=long+sleeve&filter=dotted&filter=white&rows=12`);
  });

  it('allows to pass headers to the request', () => {
    const headers = { instance: 'A1B1' };
    fetchHttpClient(endpoint, {
      properties: {
        headers
      }
    });

    expect(window.fetch).toBeCalledWith(endpoint, { headers, signal: expect.anything() });
  });

  it('allows URLs which already have parameters', async () => {
    await fetchHttpClient(`${endpoint}?additionalParam=true`, {
      parameters: {
        q: 'shirt'
      }
    });
    expectFetchCall(`${endpoint}?additionalParam=true&q=shirt`);
  });

  it('does not map undefined values', async () => {
    await fetchHttpClient(endpoint, {
      parameters: {
        q: undefined
      }
    });
    expectFetchCall(endpoint);
  });

  it('cancels equal endpoint requests if no requestId parameter is passed', async () => {
    expect.hasAssertions();
    await Promise.all([
      fetchHttpClient(endpoint, {
        parameters: {
          q: 'shirt'
        }
      }).catch(error => expect(error.code).toEqual(DOMException.ABORT_ERR)),
      fetchHttpClient(endpoint, {
        parameters: {
          q: 'jeans'
        }
      }).then(response => expect(response).toBeDefined())
    ]);
  });

  it('does not cancel equal endpoint requests if requestId parameter is passed', async () => {
    expect.hasAssertions();
    const searchUrl = `${endpoint}?additionalParam=true`;
    const empathizeUrl = 'https://api.empathy.co/empathize?additionalParam=true';
    await Promise.all([
      fetchHttpClient(searchUrl, {
        id: 'search',
        parameters: {
          q: 'shirt'
        }
      }).catch(error => expect(error.code).toEqual(DOMException.ABORT_ERR)),
      fetchHttpClient(empathizeUrl, {
        id: 'search',
        parameters: {
          q: 'shirt'
        }
      }).then(response => expect(response).toBeDefined()),
      fetchHttpClient(searchUrl, {
        parameters: {
          q: 'jeans'
        }
      }).then(response => expect(response).toBeDefined())
    ]);
  });

  it('throws an exception if the response status is not OK', async () => {
    expect.assertions(1);
    window.fetch = koFetchMock as any;
    await fetchHttpClient(endpoint, {
      parameters: {
        q: 'jeans'
      }
    }).catch(error => expect(error.response.ok).toBeFalsy());
  });
});

/**
 * Expects the `fetch` function to be called with the passed `URL`.
 *
 * @param url - The `URL` to check.
 *
 * @internal
 */
function expectFetchCall(url: string): void {
  expect((window.fetch as jest.Mock).mock.calls[0][0]).toEqual(url);
}
