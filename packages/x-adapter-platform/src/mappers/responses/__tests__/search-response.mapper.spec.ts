import { searchResponseMapper } from '../search-response.mapper';
import { PlatformSearchResponse } from '../../../types/responses/search-response.model';
import {
  platformSearchResponse,
  searchResponse
} from '../../../__tests__/__fixtures__/search.response';

describe('searchResponseMapper tests', () => {
  it('should map the response', () => {
    expect(
      searchResponseMapper(platformSearchResponse as PlatformSearchResponse, {})
    ).toStrictEqual(searchResponse);
  });
});
