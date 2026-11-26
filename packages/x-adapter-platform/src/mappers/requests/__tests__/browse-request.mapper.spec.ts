import type { BrowseRequest } from '@empathyco/x-types'
import { describe, expect, it } from 'vitest'
import { browseRequestMapper } from '../browse-request.mapper'

describe('browseRequestMapper tests', () => {
  it('should map the request', () => {
    const request: BrowseRequest = {
      browseField: 'category',
      browseValue: 'shoes',
      origin: 'default:none',
      start: 0,
      rows: 24,
      sort: 'price asc',
      filters: {},
      extraParams: { instance: 'empathy', lang: 'en' },
    } as BrowseRequest

    expect(browseRequestMapper(request, {})).toStrictEqual({
      browseField: 'category',
      browseValue: 'shoes',
      origin: 'default:none',
      start: 0,
      rows: 24,
      sort: 'price asc',
      filter: [],
      extraParams: { instance: 'empathy', lang: 'en' },
    })
  })

  it('should not add the properties that the request does not have', () => {
    const request = { browseField: 'category', browseValue: 'shoes' } as BrowseRequest

    expect(browseRequestMapper(request, {})).toStrictEqual({
      browseField: 'category',
      browseValue: 'shoes',
      filter: [],
    })
  })
})
