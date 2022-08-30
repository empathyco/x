import { identifierResultsResponseMapper } from '../identifier-results-response.mapper';
import {
  identifierResultsResponse,
  platformIdentifierResultsResponse
} from '../../../__tests__/__fixtures__/identifier-results.response';
// eslint-disable-next-line max-len
import { PlatformIdentifierResultsResponse } from '../../../types/responses/identifier-results-response.model';

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
