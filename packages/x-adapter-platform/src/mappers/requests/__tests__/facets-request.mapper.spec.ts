import type { FacetsRequest } from '@empathyco/x-types'
import { filtersStub, mappedFiltersStub } from '../../../__tests__/__fixtures__/filter'
import { facetsRequestMapper } from '../facets-request.mapper'

describe('facetsRequestMapper tests', () => {
  it('should map the request', () => {
    const internalRequest: FacetsRequest = {
      query: 'chips',
      origin: 'url:external',
      filters: filtersStub,
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile',
      },
    }

    expect(facetsRequestMapper(internalRequest, {})).toStrictEqual({
      query: 'chips',
      origin: 'url:external',
      filter: mappedFiltersStub,
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile',
      },
    })
  })
})
