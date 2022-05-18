import { NextQueriesRequest } from '@empathyco/x-types';
import { PlatformNextQueriesRequest } from '../../../types/requests/next-queries-request.model';
import { nextQueriesRequestMapper } from '../next-queries-request.mapper';

describe('nextQueriesRequestMapper tests', () => {
  const internalRequest: NextQueriesRequest = {
    query: 'chips',
    extraParams: {
      instance: 'empathy',
      env: 'test',
      lang: 'en',
      device: 'mobile',
      scope: 'mobile'
    }
  };

  it('should map the request', () => {
    const request: PlatformNextQueriesRequest = {
      query: 'chips',
      instance: 'empathy',
      env: 'test',
      lang: 'en',
      device: 'mobile',
      scope: 'mobile'
    };
    expect(nextQueriesRequestMapper(internalRequest, {})).toStrictEqual(request);
  });
});
