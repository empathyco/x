import { QuerySuggestionsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformQuerySuggestionsRequest } from '../../../types/requests/query-suggestions-request.model';
import { querySuggestionsRequestMapper } from '../../request/query-suggestions-request.mapper';

describe('querySuggestionsRequestMapper tests', () => {
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

  it('should map the request', () => {
    const request: PlatformQuerySuggestionsRequest = {
      query: 'chips',
      rows: 2,
      start: 14,
      instance: 'empathy',
      env: 'test',
      lang: 'en',
      device: 'mobile',
      scope: 'mobile'
    };
    expect(querySuggestionsRequestMapper(internalRequest, {})).toStrictEqual(request);
  });
});
