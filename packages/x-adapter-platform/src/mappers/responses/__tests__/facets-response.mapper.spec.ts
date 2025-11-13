import { platformFacetsResponse } from '../../../__tests__/__fixtures__/facets.response'
import { facetsResponseMapper } from '../facets-response.mapper'

describe('facetsResponseMapper tests', () => {
  it('should map the response', () => {
    expect(facetsResponseMapper(platformFacetsResponse, {})).toMatchSnapshot()
  })
})
