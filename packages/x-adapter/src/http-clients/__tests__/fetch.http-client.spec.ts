import { okFetchMock } from '../__mocks__/fetch.mock'
import * as httpClient from '../fetch.http-client'
import * as httpClientUtils from '../utils'

describe('fetch httpClient testing', () => {
  const endpoint = 'https://api.empathy.co/search'

  beforeEach(async () => {
    window.fetch = okFetchMock as any
    jest.clearAllMocks()
    jest.resetModules()
  })

  describe('fetchRawHttpClient', () => {
    const fetchRawHttpClient = httpClient.fetchRawHttpClient

    it('creates well formed and valid URLs', async () => {
      await fetchRawHttpClient(endpoint, {
        parameters: {
          q: 'shirt',
          filter: ['long sleeve', 'dotted', 'white'],
          rows: 12,
        },
      })
      expectFetchCallWith(
        `${endpoint}?q=shirt&filter=long+sleeve&filter=dotted&filter=white&rows=12`,
      )
    })

    it('allows to pass headers to the request', async () => {
      const headers = { instance: 'A1B1' }
      await fetchRawHttpClient(endpoint, {
        properties: {
          headers,
        },
      })

      expect(window.fetch).toHaveBeenCalledWith(endpoint, { headers, signal: expect.anything() })
    })

    it('allows URLs which already have parameters', async () => {
      await fetchRawHttpClient(`${endpoint}?additionalParam=true`, {
        parameters: {
          q: 'shirt',
        },
      })
      expectFetchCallWith(`${endpoint}?additionalParam=true&q=shirt`)
    })

    it('does not map empty values', async () => {
      await fetchRawHttpClient(endpoint, {
        parameters: {
          q: undefined,
          r: '',
          s: null,
          t: [],
          u: {},
        },
      })
      expectFetchCallWith(endpoint)
    })

    it('maps empty values if configured to do so', async () => {
      await fetchRawHttpClient(endpoint, {
        sendEmptyParams: true,
        parameters: {
          q: undefined,
          r: '',
          s: null,
          t: [],
          u: {},
        },
      })
      expectFetchCallWith(`${endpoint}?r=&s=null`)
    })

    it('cancels equal endpoint requests if no requestId parameter is passed', async () => {
      await Promise.all([
        expect(
          fetchRawHttpClient(endpoint, {
            parameters: {
              q: 'shirt',
            },
          }),
        ).rejects.toHaveProperty('code', DOMException.ABORT_ERR),
        expect(
          fetchRawHttpClient(endpoint, {
            parameters: {
              q: 'jeans',
            },
          }),
        ).resolves.toBeDefined(),
      ])
    })

    it('does not cancel equal endpoint requests if a cancelable=false parameter is passed', async () => {
      expect(
        await Promise.all([
          fetchRawHttpClient(endpoint, {
            cancelable: false,
            parameters: {
              q: 'shirt',
            },
          }),
          fetchRawHttpClient(endpoint, {
            parameters: {
              q: 'jeans',
            },
          }),
        ]),
      ).toHaveLength(2)
    })

    it('does not cancel equal endpoint requests if a different requestId parameter is passed', async () => {
      expect(
        await Promise.all([
          fetchRawHttpClient(endpoint, {
            id: 'unique-id',
            parameters: {
              q: 'shirt',
            },
          }),
          fetchRawHttpClient(endpoint, {
            parameters: {
              q: 'shirt',
            },
          }),
          fetchRawHttpClient(endpoint, {
            id: 'another-unique-id',
            parameters: {
              q: 'shirt',
            },
          }),
        ]),
      ).toHaveLength(3)
    })

    describe('when `sendParamsInBody` is `true`', () => {
      it('sends the data in the body', async () => {
        await fetchRawHttpClient(endpoint, {
          sendParamsInBody: true,
          parameters: {
            q: 'shirt',
            filter: ['long sleeve', 'dotted', 'white'],
            rows: 12,
            extraParams: {
              lang: 'en',
            },
          },
        })
        expectFetchCallWith(endpoint, {
          body: JSON.stringify({
            q: 'shirt',
            filter: ['long sleeve', 'dotted', 'white'],
            rows: 12,
            extraParams: {
              lang: 'en',
            },
          }),
        })
      })

      it('does not send empty values in the body', async () => {
        await fetchRawHttpClient(endpoint, {
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
              i: {},
            },
          },
        })
        expectFetchCallWith(endpoint, {
          body: JSON.stringify({
            q: 'shirt',
            extraParams: {
              lang: 'en',
            },
          }),
        })
      })

      it('sends empty values in the body if configured to do so', async () => {
        await fetchRawHttpClient(endpoint, {
          sendParamsInBody: true,
          sendEmptyParams: true,
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
              i: {},
            },
          },
        })
        expectFetchCallWith(endpoint, {
          body: JSON.stringify({
            q: 'shirt',
            b: null,
            c: '',
            d: [],
            extraParams: {
              lang: 'en',
              f: null,
              g: '',
              h: [],
              i: {},
            },
          }),
        })
      })
    })
  })

  describe('fetchHttpClient function', () => {
    const fetchHttpClient = httpClient.fetchHttpClient

    const fetchRawHttpClientSpy = jest.spyOn(httpClient, 'fetchRawHttpClient')
    const toJsonSpy = jest.spyOn(httpClientUtils, 'toJson')

    it('exectutes toJson and fetchRawHttpClient with the correct parameters', async () => {
      const optionsStub = {
        parameters: {
          q: 'shirt',
          filter: ['long sleeve', 'dotted', 'white'],
          rows: 12,
        },
      }

      await fetchHttpClient(endpoint, optionsStub)

      expect(fetchRawHttpClientSpy).toHaveBeenCalledWith(endpoint, optionsStub)
      expect(toJsonSpy).toHaveBeenCalledTimes(1)
    })
  })
})

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
  expect(window.fetch).toHaveBeenCalledTimes(1)
  expect(window.fetch).toHaveBeenCalledWith(url, expect.objectContaining(options))
}
