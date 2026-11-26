import type { PlatformBrowseResponse } from '../../../types/responses/browse-response.model'
import { describe, expect, it } from 'vitest'
import { platformResult, result } from '../../../__tests__/__fixtures__/result'
import { browseResponseMapper } from '../browse-response.mapper'

describe('browseResponseMapper tests', () => {
  it('should map the response', () => {
    const response = {
      catalog: {
        content: [platformResult],
        facets: [],
        numFound: 1,
        tagging: {
          browseCategory: 'https://browse.tagging/?q=shoes',
          displayBrowseCategory: 'https://display.tagging/?q=shoes',
        },
      },
    } as unknown as PlatformBrowseResponse

    const mapped = browseResponseMapper(response, {})

    expect(mapped.totalResults).toBe(1)
    expect(mapped.facets).toStrictEqual([])
    expect(mapped.results).toHaveLength(1)
    expect(mapped.results[0]).toMatchObject({ id: result.id, name: result.name })
    expect(mapped.browseTagging).toBeDefined()
    expect(mapped.displayBrowseTagging).toBeDefined()
  })

  it('should map an empty response', () => {
    expect(browseResponseMapper({} as PlatformBrowseResponse, {})).toMatchObject({
      browseTagging: expect.anything(),
    })
  })
})
