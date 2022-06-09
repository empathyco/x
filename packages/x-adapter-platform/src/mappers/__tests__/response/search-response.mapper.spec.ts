import { searchResponseMapper } from '../../responses/search-response.mapper';
import { PlatformSearchResponse } from '../../../types/response.types';
import { platformSearchResponse } from '../../../__tests__/__fixtures__/platform-search.response';
import { searchResponse } from '../../../__tests__/__fixtures__/search.response';

describe('search response mapper tests', () => {
  it('should map the response', () => {
    expect(
      searchResponseMapper(platformSearchResponse as PlatformSearchResponse, {})
    ).toStrictEqual(searchResponse);
  });
});
