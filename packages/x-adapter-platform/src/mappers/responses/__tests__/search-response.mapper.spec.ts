import { platformSearchResponse } from '../../../__tests__/__fixtures__/search.response';
import { searchResponseMapper } from '../search-response.mapper';

describe('searchResponseMapper tests', () => {
  it('should map the response', () => {
    expect(searchResponseMapper(platformSearchResponse, {})).toMatchSnapshot();
  });
});
