import { IdentifierResultsRequest } from '@empathyco/x-types';
import { identifierResultsRequestMapper } from '../identifier-results-request.mapper';

describe('identifierResultsRequestMapper tests', () => {
  it('should map the request', () => {
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

    expect(identifierResultsRequestMapper(internalRequest, {})).toStrictEqual({
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
    });
  });
});
