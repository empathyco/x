import { searchResponseMapper } from '../search-response.mapper';
import { platformSearchResponse } from '../../../__tests__/__fixtures__/search.response';

describe('searchResponseMapper tests', () => {
  it('should map the response', () => {
    expect(searchResponseMapper(platformSearchResponse, {})).toMatchSnapshot();
  });
});
