import { DeepPartial } from '@empathyco/x-utils';
import { Schema } from '../schemas.types';
import { makeSchemaMutable } from '../utils';
import { schemaMapperFactory } from '../../mappers';

describe('MutableSchemas', () => {
  interface Facet {
    id: string;
    label: string;
    count: number;
  }

  interface OriginalSource {
    q: string;
    rows: number;
    facets: Facet[];
  }

  interface CustomSource {
    data: {
      query: string;
      total: {
        rows: number;
      };
    };
    rows?: number;
  }

  interface OriginalTarget {
    query: string;
    hits: number;
  }

  interface CustomTarget {
    search: string;
    total: number;
  }

  it('Creates a mutable schema', () => {
    const originalSchema: Schema<OriginalSource, OriginalTarget> = {
      query: 'q',
      hits: 'rows'
    };
    const mutableSchema = makeSchemaMutable(originalSchema);
    expect(mutableSchema.query).toBe('q');
    expect(mutableSchema.hits).toBe('rows');
    expect(typeof mutableSchema.$replace).toBe('function');
    expect(typeof mutableSchema.$override).toBe('function');
  });

  it('should replace a schema with a new one', () => {
    const source: OriginalSource = {
      q: 'nintendo',
      rows: 1,
      facets: [{ id: 'brand', count: 99, label: 'Brand' }]
    };

    const customSource: CustomSource = {
      data: {
        query: 'Sony',
        total: {
          rows: 24
        }
      }
    };

    const originalSchema: Schema<OriginalSource, OriginalTarget> = {
      query: 'q',
      hits: 'rows'
    };

    const customSchema: Schema<CustomSource, CustomTarget> = {
      search: 'data.query',
      total: 'data.total.rows'
    };

    const originalTarget: OriginalTarget = {
      query: 'nintendo',
      hits: 1
    };

    const customTarget: CustomTarget = {
      search: 'Sony',
      total: 24
    };

    const mutableSchema = makeSchemaMutable(originalSchema);
    const mapper = schemaMapperFactory<any, any>(mutableSchema);
    expect(mapper(source, {})).toStrictEqual(originalTarget);

    mutableSchema.$replace(customSchema);
    expect(mapper(customSource, {})).toStrictEqual(customTarget);
  });

  it('should override the original schema', () => {
    const source: OriginalSource = {
      q: 'nintendo',
      rows: 1,
      facets: [{ id: 'brand', count: 99, label: 'Brand' }]
    };

    const customSource: CustomSource = {
      data: {
        query: 'Sony',
        total: {
          rows: 24
        }
      },
      rows: 99
    };

    const originalSchema: Schema<OriginalSource, OriginalTarget> = {
      query: 'q',
      hits: 'rows'
    };

    const customSchema: Schema<CustomSource, Partial<OriginalTarget>> = {
      query: 'data.query'
    };

    const originalTarget: OriginalTarget = {
      query: 'nintendo',
      hits: 1
    };

    const overrideTarget: OriginalTarget = {
      query: 'Sony',
      hits: 99
    };

    const mutableSchema = makeSchemaMutable(originalSchema);
    const mapper = schemaMapperFactory<any, any>(mutableSchema);
    expect(mapper(source, {})).toStrictEqual(originalTarget);

    mutableSchema.$override(customSchema);
    expect(mapper(customSource, {})).toStrictEqual(overrideTarget);

    const removeHitsFieldSchema: Schema<CustomSource, Partial<OriginalTarget>> = {
      query: 'data.query',
      hits: undefined
    };

    mutableSchema.$override(removeHitsFieldSchema);
    expect(mapper(customSource, {})).toStrictEqual({
      query: 'Sony'
    });
  });

  describe('should work with complex schemas', () => {
    interface ComplexSourceFilter {
      name: string;
      children: [
        {
          name: string;
          children: [
            {
              name: string;
            }
          ];
        }
      ];
    }

    interface CustomComplexSourceFilter {
      label: string;
      children: [
        {
          label: string;
          children: [
            {
              label: string;
            }
          ];
        }
      ];
    }

    interface ComplexSource {
      facets: {
        name: string;
        count: number;
        filters: ComplexSourceFilter[];
      };
    }

    interface CustomComplexSource {
      data: {
        facets: {
          label: string;
          total: number;
          f: CustomComplexSourceFilter[];
        };
      };
      facets?: {
        name: string;
      };
    }

    interface ComplexTargetFilter {
      id: string;
      numFound: number;
      filters: [
        {
          id: string;
          numFound: number;
          filters: [
            {
              id: string;
              numFound: number;
            }
          ];
        }
      ];
    }

    interface ComplexTarget {
      facet: {
        id: string;
        filters: ComplexTargetFilter[];
      };
    }

    const filtersSchema: Schema<ComplexSourceFilter, ComplexTargetFilter> = {
      id: 'name',
      numFound: (_, context) => (context?.requestParameters?.addNumFound as number) + 2,
      filters: {
        $path: 'children',
        $subSchema: '$self'
      }
    };

    const customFilterSchema: Schema<CustomComplexSourceFilter, ComplexTargetFilter> = {
      id: 'label',
      numFound: (_, context) => (context?.requestParameters?.addNumFound as number) + 10,
      filters: {
        $path: 'children',
        $subSchema: '$self'
      }
    };

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
                        label: 'XXL'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      };

      const target: ComplexTarget = {
        facet: {
          id: 'Talla',
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
                      numFound: 12
                    }
                  ]
                }
              ]
            }
          ]
        }
      };

      const schema: Schema<ComplexSource, ComplexTarget> = {
        facet: {
          id: 'facets.name',
          filters: {
            $path: 'facets.filters',
            $subSchema: filtersSchema
          }
        }
      };

      const replaceSchema: Schema<CustomComplexSource, ComplexTarget> = {
        facet: {
          id: 'data.facets.label',
          filters: {
            $path: 'data.facets.f',
            $subSchema: customFilterSchema
          }
        }
      };

      const mutable = makeSchemaMutable(schema);
      const mapper = schemaMapperFactory<any, any>(mutable);
      mutable.$replace(replaceSchema);
      expect(mapper(customSource, { requestParameters: { addNumFound: 2 } })).toStrictEqual(target);
    });

    it('should override complex schemas', () => {
      const schema: Schema<ComplexSource, ComplexTarget> = {
        facet: {
          id: 'facets.name',
          filters: {
            $path: 'facets.filters',
            $subSchema: filtersSchema
          }
        }
      };

      const overrideSchema: Schema<CustomComplexSource, DeepPartial<ComplexTarget>> = {
        facet: {
          filters: {
            $path: 'data.facets.f',
            $subSchema: customFilterSchema
          }
        }
      };

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
                        label: 'XXL'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        },
        facets: {
          name: 'Sizes'
        }
      };

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
                      numFound: 12
                    }
                  ]
                }
              ]
            }
          ]
        }
      };

      const mutable = makeSchemaMutable(schema);
      const mapper = schemaMapperFactory<any, any>(mutable);
      expect(mapper(customSource, { requestParameters: { addNumFound: 2 } })).toStrictEqual({
        facet: {
          id: 'Sizes'
        }
      });
      mutable.$override(overrideSchema);
      expect(mapper(customSource, { requestParameters: { addNumFound: 2 } })).toStrictEqual(target);
    });
  });
});
