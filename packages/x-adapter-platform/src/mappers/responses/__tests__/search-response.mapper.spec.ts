import { platformSearchResponse } from '../../../__tests__/__fixtures__/search.response';
import { PlatformSearchResponse } from '../../../types/responses/search-response.model';
import { searchResponseMapper } from '../search-response.mapper';

describe('searchResponseMapper tests', () => {
  it('should map the response', () => {
    expect(
      searchResponseMapper(platformSearchResponse as PlatformSearchResponse, {})
    ).toMatchSnapshot();
  });
});
