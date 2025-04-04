import type { PlatformIdentifierResultsResponse } from '../../../types/responses/identifier-results-response.model';
 
import {
  identifierResultsResponse,
  platformIdentifierResultsResponse
} from '../../../__tests__/__fixtures__/identifier-results.response';
import { identifierResultsResponseMapper } from '../identifier-results-response.mapper';

describe('identifierResultsResponseMapper tests', () => {
  it('should map the response', () => {
    expect(
      identifierResultsResponseMapper(
        platformIdentifierResultsResponse as unknown as PlatformIdentifierResultsResponse,
        {}
      )
    ).toStrictEqual(identifierResultsResponse);
  });
});
