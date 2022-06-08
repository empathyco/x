import { RequestError } from '../errors/request-error';
import { buildUrl, toJson } from '../utils';

describe('http-client utils tests', () => {
  describe('toJson tests', () => {
    const mockedJson = jest.fn(() => Promise.resolve({}));

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('transforms to json format if the response is ok', async () => {
      const mockedResponse = {
        ok: true,
        json: mockedJson,
        status: 200,
        statusText: 'Ok'
      };
      const response = await toJson(mockedResponse as unknown as Response).then(
        response => response
      );
      expect(response).toEqual({});
    });

    it('throws a RequestError if the response is not ok', () => {
      const mockedResponse = {
        ok: false,
        json: mockedJson,
        status: 500,
        statusText: 'Unexpected error'
      };
      expect(() => toJson(mockedResponse as unknown as Response)).toThrow(RequestError);
    });
  });

  describe('buildUrl tests', () => {
    it('returns the href property from the built URL object flattening the objects', () => {
      const params = {
        str: 'string',
        num: 0,
        bool: false,
        arr: [1, 2],
        nil: null,
        undef: undefined,
        obj: {
          str2: 'string2',
          obj2: {
            arr2: [1, 2]
          }
        }
      };
      expect(buildUrl('https://api.empathy.co', params)).toBe(
        'https://api.empathy.co/?' +
          'str=string&num=0&bool=false&arr=1&arr=2&nil=null&str2=string2&arr2=1&arr2=2'
      );
    });
  });
});
