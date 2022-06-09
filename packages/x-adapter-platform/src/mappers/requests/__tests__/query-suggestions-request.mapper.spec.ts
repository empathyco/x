import { QuerySuggestionsRequest } from '@empathyco/x-types';
import { querySuggestionsRequestMapper } from '../query-suggestions-request.mapper';

describe('querySuggestionsRequestMapper tests', () => {
  it('should map the request', () => {
    const internalRequest: QuerySuggestionsRequest = {
      query: 'chips',
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

    expect(querySuggestionsRequestMapper(internalRequest, {})).toStrictEqual({
      query: 'chips',
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
