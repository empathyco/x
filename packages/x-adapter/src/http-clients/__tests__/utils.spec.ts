import { RequestError } from '../errors/request-error'
import { buildUrl, toJson } from '../utils'

describe('http-client utils tests', () => {
  describe('toJson tests', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('transforms to json format if the response is ok', async () => {
      const mockedResponse = {
        ok: true,
        text: async () => Promise.resolve('{}'),
        status: 200,
        statusText: 'Ok',
      }
      const response = await toJson(mockedResponse as unknown as Response).then(
        response => response,
      )
      expect(response).toEqual({})
    })

    it('returns an empty object if the response is empty', async () => {
      const mockedResponse = {
        ok: true,
        text: async () => Promise.resolve(''),
        status: 200,
        statusText: 'Ok',
      }
      const response = await toJson(mockedResponse as unknown as Response).then(
        response => response,
      )
      expect(response).toEqual({})
    })

    it('throws a RequestError if the response is not ok', async () => {
      const mockedResponse = {
        ok: false,
        status: 500,
        statusText: 'Unexpected error',
      }
      await expect(toJson(mockedResponse as unknown as Response)).rejects.toThrowError(RequestError)
    })
  })

  describe('buildUrl tests', () => {
    it('returns the href property from the built URL object', () => {
      const params = {
        str: 'string',
        num: 0,
        bool: false,
        arr: [1, 2],
        nil: null,
        undef: undefined,
      }
      expect(buildUrl('https://api.empathy.co', params)).toBe(
        'https://api.empathy.co/?' + 'str=string&num=0&bool=false&arr=1&arr=2&nil=null',
      )
    })
  })
})
