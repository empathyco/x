import type { DeepPartial } from '@empathyco/x-utils'
import type { Schema } from '../types'
import { schemaMapperFactory } from '../../mappers'
import { createMutableSchema } from '../utils'

describe('mutableSchemas', () => {
  interface Facet {
    id: string
    label: string
    count: number
  }

  interface OriginalSource {
    q: string
    rows: number
    facets: Facet[]
  }

  interface CustomSource {
    data: {
      query: string
      total: {
        rows: number
      }
    }
    rows?: number
  }

  interface OriginalTarget {
    query: string
    hits: number
  }

  interface CustomTarget {
    search: string
    total: number
  }

  it('creates a mutable schema', () => {
    const originalSchema: Schema<OriginalSource, OriginalTarget> = {
      query: 'q',
      hits: 'rows',
    }
    const mutableSchema = createMutableSchema(originalSchema)
    expect(mutableSchema.query).toBe('q')
    expect(mutableSchema.hits).toBe('rows')
    expect(typeof mutableSchema.$replace).toBe('function')
    expect(typeof mutableSchema.$override).toBe('function')
  })

  it('should replace a schema with a new one', () => {
    const source: OriginalSource = {
      q: 'potatoes',
      rows: 1,
      facets: [{ id: 'brand', count: 99, label: 'Brand' }],
    }

    const customSource: CustomSource = {
      data: {
        query: 'chips',
        total: {
          rows: 24,
        },
      },
    }

    const originalSchema: Schema<OriginalSource, OriginalTarget> = {
      query: 'q',
      hits: 'rows',
    }

    const customSchema: Schema<CustomSource, CustomTarget> = {
      search: 'data.query',
      total: 'data.total.rows',
    }

    const originalTarget: OriginalTarget = {
      query: 'potatoes',
      hits: 1,
    }

    const customTarget: CustomTarget = {
      search: 'chips',
      total: 24,
    }

    const mutableSchema = createMutableSchema(originalSchema)
    const mapper = schemaMapperFactory<any, any>(mutableSchema)
    expect(mapper(source, {})).toStrictEqual(originalTarget)

    const newSchema = mutableSchema.$replace(customSchema)
    expect(newSchema.search).toBe('data.query')
    expect(newSchema.total).toBe('data.total.rows')
    expect(typeof newSchema.$override).toBe('function')
    expect(typeof newSchema.$replace).toBe('function')
    expect(mapper(customSource, {})).toStrictEqual(customTarget)
  })

  it('should override the original schema', () => {
    const source: OriginalSource = {
      q: 'potatoes',
      rows: 1,
      facets: [{ id: 'brand', count: 99, label: 'Brand' }],
    }

    const customSource: CustomSource = {
      data: {
        query: 'chips',
        total: {
          rows: 24,
        },
      },
      rows: 99,
    }

    const originalTarget: OriginalTarget = {
      query: 'potatoes',
      hits: 1,
    }

    const overrideTarget: OriginalTarget = {
      query: 'chips',
      hits: 99,
    }

    const mutableSchema = createMutableSchema<OriginalSource, OriginalTarget>({
      query: 'q',
      hits: 'rows',
    })
    const mapper = schemaMapperFactory<OriginalSource, OriginalTarget>(mutableSchema)
    expect(mapper(source, {})).toStrictEqual(originalTarget)

    const newSchema = mutableSchema.$override<CustomSource>({
      query: 'data.query',
    })
    expect(newSchema.query).toBe('data.query')
    expect(newSchema.hits).toBe('rows')
    expect(typeof newSchema.$override).toBe('function')
    expect(typeof newSchema.$replace).toBe('function')
    expect(mapper(customSource as any, {})).toStrictEqual(overrideTarget)

    mutableSchema.$override<CustomSource, { hits?: undefined }>({
      query: 'data.query',
      hits: undefined,
    })
    expect(mapper(customSource as any, {})).toStrictEqual({
      query: 'chips',
    })
  })

  it('should extends the original schema without modifying it', () => {
    const source: OriginalSource = {
      q: 'potatoes',
      rows: 1,
      facets: [{ id: 'brand', count: 99, label: 'Brand' }],
    }

    interface ExtendedSource extends OriginalSource {
      someExtraField: string
    }

    interface ExtendedTarget extends OriginalTarget {
      extra: string
    }

    const originalSchema: Schema<OriginalSource, OriginalTarget> = {
      query: 'q',
      hits: 'rows',
    }

    const originalTarget: OriginalTarget = {
      query: 'potatoes',
      hits: 1,
    }

    const extendedTarget: ExtendedTarget = {
      ...originalTarget,
      extra: 'extended',
    }

    const mutableSchema = createMutableSchema(originalSchema)
    const mapperFromOriginal = schemaMapperFactory<OriginalSource, OriginalTarget>(mutableSchema)

    const extendedSchema = mutableSchema.$extends<ExtendedSource, { extra: string }>({
      extra: 'someExtraField',
    })
    const extendedSchemaWithExtendedObjects = mutableSchema.$extends<
      ExtendedSource,
      ExtendedTarget
    >({
      extra: 'someExtraField',
    })

    const mapperFromExtended = schemaMapperFactory(extendedSchema)
    const mapperFromExtendedObjects = schemaMapperFactory(extendedSchemaWithExtendedObjects)

    expect(mapperFromExtended({ ...source, someExtraField: 'extended' }, {})).toStrictEqual(
      extendedTarget,
    )
    expect(mapperFromExtendedObjects({ ...source, someExtraField: 'extended' }, {})).toStrictEqual(
      extendedTarget,
    )
    expect(mapperFromOriginal({ ...source, someExtraField: 'extended' } as any, {})).toStrictEqual(
      originalTarget,
    )
  })

  describe('should work with complex schemas', () => {
    interface ComplexSourceFilter {
      name: string
      children: [
        {
          name: string
          children: [
            {
              name: string
            },
          ]
        },
      ]
    }

    interface CustomComplexSourceFilter {
      label: string
      children: [
        {
          label: string
          children: [
            {
              label: string
            },
          ]
        },
      ]
    }

    interface ComplexSource {
      facets: {
        name: string
        count: number
        filters: ComplexSourceFilter[]
      }
    }

    interface CustomComplexSource {
      data: {
        facets: {
          label: string
          total: number
          f: CustomComplexSourceFilter[]
        }
      }
      facets?: {
        name: string
      }
    }

    interface ComplexTargetFilter {
      id: string
      numFound: number
      filters: [
        {
          id: string
          numFound: number
          filters: [
            {
              id: string
              numFound: number
            },
          ]
        },
      ]
    }

    interface ComplexTarget {
      facet: {
        id: string
        filters: ComplexTargetFilter[]
      }
    }

    const filtersSchema: Schema<ComplexSourceFilter, ComplexTargetFilter> = {
      id: 'name',
      numFound: (_, context) => (context?.requestParameters?.addNumFound as number) + 2,
      filters: {
        $path: 'children',
        $subSchema: '$self',
      },
    }

    const customFilterSchema: Schema<CustomComplexSourceFilter, ComplexTargetFilter> = {
      id: 'label',
      numFound: (_, context) => (context?.requestParameters?.addNumFound as number) + 10,
      filters: {
        $path: 'children',
        $subSchema: '$self',
      },
    }

    it('should serialize the schema', () => {
      const a: Schema<ComplexSource, ComplexTarget> = {
        facet: {
          id: 'facets.name',
          filters: {
            $path: 'facets.filters',
            $subSchema: filtersSchema,
          },
        },
      }
      const mutable = createMutableSchema(a)

      const mutableSerialized = `facet: {
  id: facets.name,
  filters: {
    $path: facets.filters,
    $subSchema: {
      id: name,
      numFound: (_, context) => { var _a; return ((_a = context === null || context === void 0 ? void 0 : context.requestParameters) === null || _a === void 0 ? void 0 : _a.addNumFound) + 2; },
      filters: {
        $path: children,
        $subSchema: $self,
      },
    },
  },
},`

      expect(mutable.toString().trim()).toStrictEqual(mutableSerialized)
      expect(mutable.toString(true).trim()).toContain('$replace: $replace(newSchema) {')
      expect(mutable.toString(true).trim()).toContain('$override: $override(newSchema) {')
      expect(mutable.toString(true).trim()).toContain('$extends: $extends(newSchema) {')
    })

    it('should replace complex schemas', () => {
      const customSource: CustomComplexSource = {
        data: {
          facets: {
            label: 'Talla',
            total: 300788,
            f: [
              {
                label: 'L',
                children: [
                  {
                    label: 'XL',
                    children: [
                      {
                        label: 'XXL',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      }

      const target: DeepPartial<ComplexTarget> = {
        facet: {
          filters: [
            {
              id: 'L',
              numFound: 12,
              filters: [
                {
                  id: 'XL',
                  numFound: 12,
                  filters: [
                    {
                      id: 'XXL',
                      numFound: 12,
                    },
                  ],
                },
              ],
            },
          ],
        },
      }

      const schema: Schema<ComplexSource, ComplexTarget> = {
        facet: {
          id: 'facets.name',
          filters: {
            $path: 'facets.filters',
            $subSchema: filtersSchema,
          },
        },
      }

      const replaceSchema: Schema<CustomComplexSource, DeepPartial<ComplexTarget>> = {
        facet: {
          filters: {
            $path: 'data.facets.f',
            $subSchema: customFilterSchema,
          },
        },
      }

      const mutable = createMutableSchema(schema)
      const mapper = schemaMapperFactory<any, any>(mutable)
      mutable.$replace(replaceSchema)
      expect(mapper(customSource, { requestParameters: { addNumFound: 2 } })).toStrictEqual(target)
    })

    it('should override complex schemas', () => {
      const customSource: CustomComplexSource = {
        data: {
          facets: {
            label: 'Talla',
            total: 21289,
            f: [
              {
                label: 'L',
                children: [
                  {
                    label: 'XL',
                    children: [
                      {
                        label: 'XXL',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        facets: {
          name: 'Sizes',
        },
      }

      const target: ComplexTarget = {
        facet: {
          id: 'Sizes',
          filters: [
            {
              id: 'L',
              numFound: 12,
              filters: [
                {
                  id: 'XL',
                  numFound: 12,
                  filters: [
                    {
                      id: 'XXL',
                      numFound: 12,
                    },
                  ],
                },
              ],
            },
          ],
        },
      }

      const mutable = createMutableSchema<ComplexSource, ComplexTarget>({
        facet: {
          id: 'facets.name',
          filters: {
            $path: 'facets.filters',
            $subSchema: filtersSchema,
          },
        },
      })
      const mapper = schemaMapperFactory<ComplexSource, ComplexTarget>(mutable)
      expect(mapper(customSource as any, { requestParameters: { addNumFound: 2 } })).toStrictEqual({
        facet: {
          id: 'Sizes',
        },
      })
      mutable.$override<CustomComplexSource>({
        facet: {
          filters: {
            $path: 'data.facets.f',
            $subSchema: customFilterSchema,
          },
        },
      })
      expect(mapper(customSource as any, { requestParameters: { addNumFound: 2 } })).toStrictEqual(
        target,
      )
    })
  })
})
