import { Schema } from '../../schemas/types';
import { schemaMapperFactory } from '../schema-mapper.factory';

describe('schemaMapperFactory tests', () => {
  interface Facet {
    id: string;
    label: string;
    count: number;
  }

  interface Filter {
    title: string;
    hits: number;
  }

  interface Source {
    q: string;
    rows: number;
    facets: Facet[];
  }

  interface Target {
    query: string;
    hits: number;
  }

  interface ComposedTarget extends Target {
    filters: Filter[];
  }

  it('creates a mapper function given a simple schema', () => {
    const source: Source = {
      q: 'potatoe',
      rows: 10,
      facets: []
    };
    const target: Target = {
      query: 'potatoe',
      hits: 11
    };
    const schema: Schema<Source, Target> = {
      query: 'q',
      hits: ({ rows }) => rows + 1
    };

    const mapper = schemaMapperFactory(schema);
    expect(mapper(source, {})).toStrictEqual(target);
  });

  it('creates a mapper function given a simple schema and an empty object as source', () => {
    const target: Target = {
      query: 'test',
      hits: 2
    };

    const schema: Schema<unknown, Target> = {
      query: () => 'test',
      hits: () => 2
    };
    const mapper = schemaMapperFactory(schema);
    expect(mapper({}, {})).toStrictEqual(target);
  });

  it('creates a mapper function given a simple schema fed with mapper context data', () => {
    const source: Source = {
      q: 'random',
      rows: 5,
      facets: []
    };
    const target: Target = {
      query: 'random',
      hits: 5
    };
    const schema: Schema<Source, Target> = {
      query: ({ q }, context) => (context?.endpoint?.match(/search/gi) ? q : ''),
      hits: 'rows'
    };

    const mapper = schemaMapperFactory(schema);
    expect(mapper(source, { endpoint: 'https://api.empathy.co/search' })).toStrictEqual(target);
  });

  it('creates a mapper function given an schema that applies another subSchema', () => {
    const source: Source = {
      q: 'potatoe',
      rows: 10,
      facets: [
        { id: 'brand', count: 1, label: 'Brand' },
        { id: 'age', count: 2, label: 'Age' }
      ]
    };
    const target: ComposedTarget = {
      query: 'potatoe',
      hits: 10,
      filters: [
        { title: 'Brand', hits: 1 },
        { title: 'Age', hits: 2 }
      ]
    };
    const filterSchema: Schema<Source['facets'][0], ComposedTarget['filters'][0]> = {
      title: 'label',
      hits: 'count'
    };
    const schema: Schema<Source, ComposedTarget> = {
      query: 'q',
      hits: 'rows',
      // TODO: Improve type to handle array of objects properly
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filters: {
        $path: 'facets',
        $subSchema: filterSchema
      }
    };

    const mapper = schemaMapperFactory(schema);
    expect(mapper(source, {})).toStrictEqual(target);
  });

  it('creates a mapper function given a complex schema', () => {
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

    interface ComplexSource {
      facets: {
        name: string;
        count: number;
        filters: ComplexSourceFilter[];
      };
    }

    const source: ComplexSource = {
      facets: {
        name: 'size',
        count: 23423,
        filters: [
          {
            name: 's',
            children: [
              {
                name: 'xs',
                children: [
                  {
                    name: 'xxs'
                  }
                ]
              }
            ]
          }
        ]
      }
    };

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

    const target: ComplexTarget = {
      facet: {
        id: 'size',
        filters: [
          {
            id: 's',
            numFound: 4,
            filters: [
              {
                id: 'xs',
                numFound: 4,
                filters: [
                  {
                    id: 'xxs',
                    numFound: 4
                  }
                ]
              }
            ]
          }
        ]
      }
    };

    const filtersSchema: Schema<ComplexSourceFilter, ComplexTargetFilter> = {
      id: 'name',
      numFound: (_, context) => (context?.requestParameters?.addNumFound as number) + 2,
      filters: {
        $path: 'children',
        $subSchema: '$self'
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

    const mapper = schemaMapperFactory(schema);
    expect(mapper(source, { requestParameters: { addNumFound: 2 } })).toStrictEqual(target);
  });

  it('should resolve the context from the source', () => {
    interface Facet {
      facet: string;
      isParent: boolean;
      children: Filter[];
    }

    interface Filter {
      id: string;
      value: string;
    }

    interface TargetFacet {
      id: string;
      filters: TargetFilter[];
    }

    interface TargetFilter {
      filterId: string;
      parentId: string;
      value: string;
    }

    const filterSchema: Schema<Filter, TargetFilter> = {
      filterId: 'id',
      value: 'value',
      parentId: (_, $context) => ($context?.hasParent ? ($context?.parentId as string) : '')
    };

    const facetSchema: Schema<Facet, TargetFacet> = {
      id: 'facet',
      filters: {
        $path: 'children',
        $subSchema: filterSchema,
        $context: {
          parentId: 'facet',
          hasParent: ({ isParent }: Facet) => isParent
        }
      }
    };

    const source: Facet = {
      facet: 'category',
      isParent: true,
      children: [
        {
          id: 'category:man',
          value: 'man'
        }
      ]
    };

    const mapper = schemaMapperFactory(facetSchema);
    expect(mapper(source, { requestParameters: { addNumFound: 2 } })).toStrictEqual<TargetFacet>({
      id: 'category',
      filters: [
        {
          filterId: 'category:man',
          value: 'man',
          parentId: 'category'
        }
      ]
    });
  });
});
