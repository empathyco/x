import { describe, expect, it } from 'vitest'
import { deepMergeWithDefaults } from '../deep-merge-with-defaults'

describe('deepMergeWithDefaults', () => {
  it('returns the defaults (with a new top-level object) when no overrides are given', () => {
    const defaults = { a: 1, b: { c: 'default' } }
    const result = deepMergeWithDefaults(defaults)
    expect(result).toEqual(defaults)
    expect(result).not.toBe(defaults)
  })

  it('lets leaf overrides win', () => {
    expect(deepMergeWithDefaults({ a: 1, b: 'default' }, { a: 2 })).toEqual({ a: 2, b: 'default' })
  })

  it('keeps the default value for undefined overrides', () => {
    expect(deepMergeWithDefaults({ a: 1, b: { c: 2 } }, { b: undefined })).toEqual({
      a: 1,
      b: { c: 2 },
    })
  })

  it('merges nested objects at any depth', () => {
    const defaults = {
      level1: {
        level2: {
          level3: {
            level4: { keep: 'default', override: 'default' },
          },
          other: 'kept',
        },
      },
      root: 'kept',
    }
    const result = deepMergeWithDefaults(defaults, {
      level1: { level2: { level3: { level4: { override: 'overridden' } } } },
    })
    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            level4: { keep: 'default', override: 'overridden' },
          },
          other: 'kept',
        },
      },
      root: 'kept',
    })
  })

  it('replaces the default function when an override function is provided', () => {
    const defaultFn: (page: number) => string = page => `Default ${page}`
    const overrideFn: (page: number) => string = page => `Page ${page}`
    const result = deepMergeWithDefaults({ a: { fn: defaultFn } }, { a: { fn: overrideFn } })
    expect(result.a.fn).toBe(overrideFn)
    expect(result.a.fn(3)).toEqual('Page 3')
  })

  it('keeps the default function when no override is provided', () => {
    const defaultFn = () => 'default'
    const result = deepMergeWithDefaults({ a: { fn: defaultFn, b: 1 } }, { a: { b: 2 } })
    expect(result.a.fn).toBe(defaultFn)
    expect(result.a.b).toEqual(2)
  })

  it('ignores unknown override keys at any depth', () => {
    const result = deepMergeWithDefaults(
      { a: { b: 1 } } as { a: { b: number } },
      { a: { b: 2, unknown: 'ignored' }, rootUnknown: 'ignored' } as never,
    )
    expect(result).toEqual({ a: { b: 2 } })
  })

  it('treats arrays as leaves and replaces them', () => {
    const defaults = { a: { list: [1, 2, 3] } }
    const result = deepMergeWithDefaults(defaults, { a: { list: [9] } })
    expect(result.a.list).toEqual([9])
  })

  it('lets a non-object override replace a whole default object', () => {
    const result = deepMergeWithDefaults(
      { a: { b: 1 } } as { a: { b: number } | string },
      {
        a: 'replaced',
      } as never,
    )
    expect(result).toEqual({ a: 'replaced' })
  })

  it('does not mutate the defaults or the overrides', () => {
    const defaults = { a: { b: 1, c: 2 } }
    const overrides = { a: { b: 10 } }
    const defaultsSnapshot = JSON.stringify(defaults)
    const overridesSnapshot = JSON.stringify(overrides)

    deepMergeWithDefaults(defaults, overrides)

    expect(JSON.stringify(defaults)).toEqual(defaultsSnapshot)
    expect(JSON.stringify(overrides)).toEqual(overridesSnapshot)
  })
})
