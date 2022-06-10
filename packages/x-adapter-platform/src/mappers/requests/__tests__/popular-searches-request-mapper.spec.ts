import { PopularSearchesRequest } from '@empathyco/x-types';
import { popularSearchesRequestMapper } from '../popular-searches-request.mapper';

describe('popularSearchesRequestMapper tests', () => {
  it('should map the request', () => {
    const internalRequest: PopularSearchesRequest = {
      rows: 2,
      start: 14,
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile'
      }
    };

    expect(popularSearchesRequestMapper(internalRequest, {})).toStrictEqual({
      rows: 2,
      start: 14,
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile'
      }
    });
  });
});
