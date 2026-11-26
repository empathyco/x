import type { Result } from '@empathyco/x-types'
import type { PlatformSearchResponse } from '../../types/responses/search-response.model'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as z from 'zod/mini'
import { platformSearchResponse } from '../../__tests__/__fixtures__/search.response'
import { searchResponseMapper } from '../../mappers/responses/search-response.mapper'
import { resultSchema } from '../models/result.schema'

describe('platform schemas customization', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  const response = platformSearchResponse as unknown as PlatformSearchResponse
  const originalName = searchResponseMapper(response, {}).results[0].name

  afterEach(() => {
    warn.mockClear()
  })

  it('does not modify the shared schema with $extends', () => {
    const extended = resultSchema.$extends({ transform: () => ({ name: 'extended' }) })

    expect(extended.parse(platformSearchResponse.catalog.content[0]).name).toBe('extended')
    expect(searchResponseMapper(response, {}).results[0].name).toBe(originalName)
  })

  it('validates the extra source properties with a Zod schema', () => {
    const extended = resultSchema.$extends({
      source: z.looseObject({ season: z.string() }),
      transform: source => ({ season: source.season }) as Partial<Result>,
    })

    extended.parse({ ...platformSearchResponse.catalog.content[0], season: 3 })

    expect(warn).toHaveBeenCalledTimes(1)
  })

  // Keep it last: it modifies the shared schema for the rest of the file.
  it('applies a $override of a shared schema to the mappers that use it', () => {
    const clone = resultSchema.$extends({ transform: () => ({}) })

    resultSchema.$override({
      transform: (_source, target) =>
        ({ name: `${target.name}!`, season: 'winter' }) as Partial<Result>,
    })

    const [first] = searchResponseMapper(response, {}).results

    expect(first.name).toBe(`${originalName}!`)
    expect((first as Result & { season: string }).season).toBe('winter')
    // A $extends created before the override is not modified.
    expect(clone.parse(platformSearchResponse.catalog.content[0]).name).toBe(originalName)
  })
})
