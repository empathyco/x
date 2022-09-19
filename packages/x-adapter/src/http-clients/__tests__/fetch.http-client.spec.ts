import { koFetchMock, okFetchMock } from '../__mocks__/fetch.mock';
import { HttpClient } from '../types';

describe('fetch httpClient testing', () => {
  const endpoint = 'https://api.empathy.co/search';

  let fetchHttpClient: HttpClient;

  beforeEach(async () => {
    fetchHttpClient = (await import('../fetch.http-client')).fetchHttpClient;
    window.fetch = okFetchMock as any;
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('creates well formed and valid URLs', async () => {
    await fetchHttpClient(endpoint, {
      parameters: {
        q: 'shirt',
        filter: ['long sleeve', 'dotted', 'white'],
        rows: 12
      }
    });
    expectFetchCallWith(
      `${endpoint}?q=shirt&filter=long+sleeve&filter=dotted&filter=white&rows=12`
    );
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
    expectFetchCallWith(`${endpoint}?additionalParam=true&q=shirt`);
  });

  it('does not map empty values', async () => {
    await fetchHttpClient(endpoint, {
      parameters: {
        q: undefined,
        r: '',
        s: null,
        t: [],
        u: {}
      }
    });
    expectFetchCallWith(endpoint);
  });

  it('cancels equal endpoint requests if no requestId parameter is passed', async () => {
    await Promise.all([
      expect(
        fetchHttpClient(endpoint, {
          parameters: {
            q: 'shirt'
          }
        })
      ).rejects.toHaveProperty('code', DOMException.ABORT_ERR),
      expect(
        fetchHttpClient(endpoint, {
          parameters: {
            q: 'jeans'
          }
        })
      ).resolves.toBeDefined()
    ]);
  });

  // eslint-disable-next-line max-len
  it('does not cancel equal endpoint requests if a cancelable=false parameter is passed', async () => {
    expect(
      await Promise.all([
        fetchHttpClient(endpoint, {
          cancelable: false,
          parameters: {
            q: 'shirt'
          }
        }),
        fetchHttpClient(endpoint, {
          parameters: {
            q: 'jeans'
          }
        })
      ])
    ).toHaveLength(2);
  });

  // eslint-disable-next-line max-len
  it('does not cancel equal endpoint requests if a different requestId parameter is passed', async () => {
    expect(
      await Promise.all([
        fetchHttpClient(endpoint, {
          id: 'unique-id',
          parameters: {
            q: 'shirt'
          }
        }),
        fetchHttpClient(endpoint, {
          parameters: {
            q: 'shirt'
          }
        }),
        fetchHttpClient(endpoint, {
          id: 'another-unique-id',
          parameters: {
            q: 'shirt'
          }
        })
      ])
    ).toHaveLength(3);
  });

  it('throws an exception if the response status is not OK', async () => {
    window.fetch = koFetchMock as any;
    await expect(
      fetchHttpClient(endpoint, {
        parameters: {
          q: 'jeans'
        }
      })
    ).rejects.toThrow();
  });

  describe('when `sendParamsInBody` is `true`', () => {
    it('sends the data in the body', async () => {
      await fetchHttpClient(endpoint, {
        sendParamsInBody: true,
        parameters: {
          q: 'shirt',
          filter: ['long sleeve', 'dotted', 'white'],
          rows: 12,
          extraParams: {
            lang: 'en'
          }
        }
      });
      expectFetchCallWith(endpoint, {
        body: JSON.stringify({
          q: 'shirt',
          filter: ['long sleeve', 'dotted', 'white'],
          rows: 12,
          extraParams: {
            lang: 'en'
          }
        })
      });
    });

    it('does not send empty values in the body', async () => {
      await fetchHttpClient(endpoint, {
        sendParamsInBody: true,
        parameters: {
          q: 'shirt',
          a: undefined,
          b: null,
          c: '',
          d: [],
          extraParams: {
            lang: 'en',
            e: undefined,
            f: null,
            g: '',
            h: [],
            i: {}
          }
        }
      });
      expectFetchCallWith(endpoint, {
        body: JSON.stringify({
          q: 'shirt',
          extraParams: {
            lang: 'en'
          }
        })
      });
    });
  });
});

/**
 * Expects the `fetch` function to be called with the passed `URL`.
 *
 * @param url - The `URL` to check.
 * @param options - An optional and partial `fetch` request init options to assert that fetch has
 * been called with those parameters.
 *
 * @internal
 */
function expectFetchCallWith(url: string, options: RequestInit = {}): void {
  expect(window.fetch).toHaveBeenCalledTimes(1);
  expect(window.fetch).toHaveBeenCalledWith(url, expect.objectContaining(options));
}
