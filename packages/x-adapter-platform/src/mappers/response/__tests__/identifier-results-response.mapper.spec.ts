import { identifierResultsResponseMapper } from '../../response/identifier-results-response.mapper';
/* eslint-disable max-len */
import { platformIdentifierResultsResponse } from '../../../__tests__/__fixtures__/platform-identifier-results.response';
import { PlatformIdentifierResultsResponse } from '../../../types/responses/identifier-results-response.model';
import { identifierResultsResponse } from '../../../__tests__/__fixtures__/identifier-results.response';
/* eslint-enable max-len */

describe('identifier results response mapper tests', () => {
  it('should map the identifier results response', () => {
    expect(
      identifierResultsResponseMapper(
        platformIdentifierResultsResponse as unknown as PlatformIdentifierResultsResponse,
        {}
      )
    ).toStrictEqual(identifierResultsResponse);
  });
});
