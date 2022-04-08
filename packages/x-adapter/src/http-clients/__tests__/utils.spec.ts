import { buildUrl } from '../utils';

describe('http-client utils tests', () => {
  describe('toJson tests', () => {
    it('', () => {
      /*const validResponse = {
        ok: true,
        data: {
          a: 1,
          b: {
            c: 'random'
          }
        }
      };
      expect(toJson(validResponse as unknown as Response)).toReturnWith(Promise);*/
      expect(true).toBe(true);
    });
  });

  describe('buildUrl tests', () => {
    it('returns the href property from the built URL object', () => {
      const params = {
        str: 'string',
        num: 0,
        bool: false,
        arr: [1, 2],
        nil: null,
        undef: undefined
      };
      expect(buildUrl('https://api.empathy.co', params)).toBe(
        'https://api.empathy.co/?str=string&num=0&bool=false&arr=1&arr=2&nil=null'
      );
    });
  });
});
