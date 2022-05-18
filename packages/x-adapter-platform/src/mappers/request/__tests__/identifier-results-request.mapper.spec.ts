import { IdentifierResultsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformIdentifierResultsRequest } from '../../../types/requests/identifier-results-request.model';
import { identifierResultsRequestMapper } from '../../request/identifier-results-request.mapper';

describe('identifierResultsRequestMapper tests', () => {
  const internalRequest: IdentifierResultsRequest = {
    query: 'chips',
    rows: 2,
    start: 14,
    origin: 'url:external',
    extraParams: {
      instance: 'empathy',
      env: 'test',
      lang: 'en',
      device: 'mobile',
      scope: 'mobile'
    }
  };

  it('should map the request', () => {
    const request: PlatformIdentifierResultsRequest = {
      query: 'chips',
      rows: 2,
      start: 14,
      origin: 'url:external',
      instance: 'empathy',
      env: 'test',
      lang: 'en',
      device: 'mobile',
      scope: 'mobile'
    };
    expect(identifierResultsRequestMapper(internalRequest, {})).toStrictEqual(request);
  });
});
