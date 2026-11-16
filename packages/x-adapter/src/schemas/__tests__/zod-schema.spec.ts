import type { MapperContext } from '../../mappers/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { zSchemaMapperFactory } from '../../mappers/zod-schema-mapper.factory'
import { createMutableZodSchema, isMutableZodSchema } from '../zod-schema'

interface Target {
  id: string
  price: { value: number; currency: string }
}

function createSchema() {
  return createMutableZodSchema({
    source: z.looseObject({ sku: z.string(), cost: z.number() }),
    transform: (source, context): Target => ({
      id: source.sku,
      price: { value: source.cost, currency: (context.currency as string) ?? 'EUR' },
    }),
  })
}

describe('createMutableZodSchema', () => {
  const warn = vi.spyOn(console, 'warn')

  beforeEach(() => {
    warn.mockImplementation(() => {})
  })

  afterEach(() => {
    warn.mockReset()
  })

  it('validates the source and maps it to the target', () => {
    expect(createSchema().parse({ sku: 'a', cost: 5 })).toStrictEqual({
      id: 'a',
      price: { value: 5, currency: 'EUR' },
    })
    expect(warn).not.toHaveBeenCalled()
  })

  it('provides the context to the transformation', () => {
    expect(createSchema().parse({ sku: 'a', cost: 5 }, { currency: 'USD' }).price.currency).toBe(
      'USD',
    )
  })

  it('maps the raw source and warns once per issue if the source is not valid', () => {
    const schema = createSchema()

    expect(schema.parse({ sku: 'a', cost: '5' }).price.value).toBe('5')
    expect(schema.parse({ sku: 'b', cost: '6' }).price.value).toBe('6')
    expect(warn).toHaveBeenCalledTimes(1)

    schema.parse({ sku: 1, cost: 5 })
    expect(warn).toHaveBeenCalledTimes(2)
  })

  it('applies the output of the validator: defaults, coercions...', () => {
    const schema = createMutableZodSchema({
      source: z.object({ rows: z.coerce.number().default(24) }),
      transform: source => source,
    })

    expect(schema.parse({})).toStrictEqual({ rows: 24 })
    expect(schema.parse({ rows: '12' })).toStrictEqual({ rows: 12 })
  })

  it('warns and returns undefined if there is no source', () => {
    expect(createSchema().parse(undefined)).toBeUndefined()
    expect(createSchema().parse(null)).toBeUndefined()
    expect(warn).toHaveBeenCalledTimes(2)
  })

  it('does not validate the source if there is no validator', () => {
    const schema = createMutableZodSchema<{ q: string }, { query: string }>({
      transform: source => ({ query: source.q }),
    })

    expect(schema.parse({ q: 'shoes' })).toStrictEqual({ query: 'shoes' })
  })

  it('does not add to the target the properties that are undefined', () => {
    const schema = createMutableZodSchema<{ q?: string; rows?: number }, object>({
      transform: source => ({ query: source.q, rows: source.rows, nested: { rows: source.rows } }),
    }).$override({ transform: () => ({ query: undefined, sort: undefined }) })

    expect(schema.parse({ q: 'shoes' })).toStrictEqual({
      query: 'shoes',
      nested: { rows: undefined },
    })
  })

  it('maps sources that are not objects', () => {
    const schema = createMutableZodSchema({
      source: z.string(),
      transform: query => ({ query }),
    })

    expect(schema.parse('shoes')).toStrictEqual({ query: 'shoes' })
  })

  describe('$override', () => {
    it('modifies the schema, so the schemas that use it apply the modification', () => {
      const schema = createSchema()
      const listSchema = createMutableZodSchema({
        source: z.object({ items: z.array(z.unknown()) }),
        transform: (source, context) => source.items.map(item => schema.parse(item, context)),
      })

      const overridden = schema.$override({
        source: z.looseObject({ brand: z.string() }),
        transform: (source, target, context) => ({
          brand: source.brand,
          price: { ...target.price, value: source.cost * (context.rate as number) },
        }),
      })

      expect(overridden).toBe(schema)
      expect(listSchema.parse({ items: [{ sku: 'a', cost: 5, brand: 'x' }] }, { rate: 2 })).toEqual(
        [{ id: 'a', brand: 'x', price: { value: 10, currency: 'EUR' } }],
      )
    })

    it('validates the new properties of the source', () => {
      const schema = createSchema().$override({
        source: z.looseObject({ brand: z.string() }),
        transform: source => ({ brand: source.brand }),
      })

      expect(schema.parse({ sku: 'a', cost: 5, brand: 3 }).brand).toBe(3)
      expect(warn).toHaveBeenCalledTimes(1)
    })

    it('keeps the properties that the validators strip', () => {
      const schema = createMutableZodSchema({
        source: z.object({ sku: z.string() }),
        transform: source => ({ id: source.sku }),
      }).$override<{ brand: string }, { brand: string }>({
        transform: source => ({ brand: source.brand }),
      })

      expect(schema.parse({ sku: 'a', brand: 'x' })).toStrictEqual({ id: 'a', brand: 'x' })
    })
  })

  describe('$extends', () => {
    it('creates a new schema without modifying the original one', () => {
      const schema = createSchema()
      const extended = schema.$extends({ transform: () => ({ id: 'extended', isNew: true }) })
      schema.$override({ transform: () => ({ id: 'overridden' }) })

      expect(extended.parse({ sku: 'a', cost: 5 })).toStrictEqual({
        id: 'extended',
        isNew: true,
        price: { value: 5, currency: 'EUR' },
      })
      expect(schema.parse({ sku: 'a', cost: 5 })).toStrictEqual({
        id: 'overridden',
        price: { value: 5, currency: 'EUR' },
      })
    })
  })

  describe('$replace', () => {
    it('replaces the validator and the transformation of the schema', () => {
      const schema = createSchema()
      schema.$override({ transform: () => ({ id: 'overridden' }) })

      const replaced = schema.$replace({
        source: z.object({ name: z.string() }),
        transform: source => ({ title: source.name }),
      })

      expect(replaced).toBe(schema)
      expect(replaced.parse({ name: 'shoes' })).toStrictEqual({ title: 'shoes' })
      expect(warn).not.toHaveBeenCalled()
    })
  })
})

describe('zSchemaMapperFactory', () => {
  const context: MapperContext = { currency: 'USD' }

  it('creates a mapper for a mutable zod schema that receives the context', () => {
    const mapper = zSchemaMapperFactory<{ sku: string; cost: number }, Target>(createSchema())

    expect(mapper({ sku: 'a', cost: 5 }, context)).toStrictEqual({
      id: 'a',
      price: { value: 5, currency: 'USD' },
    })
  })

  it('creates a strict mapper for a raw zod schema', () => {
    const schema = z.object({ q: z.string() }).transform(({ q }) => ({ query: q }))
    const mapper = zSchemaMapperFactory<{ q: unknown }, { query: string }>(schema)

    expect(isMutableZodSchema(schema)).toBe(false)
    expect(mapper({ q: 'shoes' }, context)).toStrictEqual({ query: 'shoes' })
    expect(() => mapper({ q: 1 }, context)).toThrow()
  })
})
