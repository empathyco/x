import type { SearchRequest } from '@empathyco/x-types'
import { filtersStub, mappedFiltersStub } from '../../../__tests__/__fixtures__/filter'
import { searchRequestMapper } from '../../requests/search-request.mapper'

describe('searchRequestMapper tests', () => {
  it('should map the request', () => {
    const internalRequest: SearchRequest = {
      query: 'chips',
      origin: 'url:external',
      start: 14,
      rows: 2,
      sort: 'price asc',
      filters: filtersStub,
      extraParams: {
        instance: 'empathy',
        env: 'test',
        lang: 'en',
        device: 'mobile',
        scope: 'mobile',
      },
    }

    expect(searchRequestMapper(internalRequest, {})).toStrictEqual({
      query: 'chips',
      origin: 'url:external',
      start: 14,
      rows: 2,
      sort: 'price asc',
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
