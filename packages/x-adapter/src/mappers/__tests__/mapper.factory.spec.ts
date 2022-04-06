import { Schema } from '../../schemas/schemas.types';
import { mapperFactory } from '../mapper.factory';

describe('mapperFactory tests', () => {
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
      facets: [{ id: 'brand', count: 1, label: 'Brand' }]
    };
    const target: Target = {
      query: 'potatoe',
      hits: 11
    };
    const schema: Schema<Source, Target> = {
      query: 'q',
      hits: ({ rows }) => rows + 1
    };

    const mapper = mapperFactory(schema);
    expect(mapper(source, {})).toStrictEqual(target);
  });

  it('creates a mapper function given a simple schema fed with mapper context data', () => {
    const source: Source = {
      q: 'potatoe',
      rows: 10,
      facets: [{ id: 'brand', count: 1, label: 'Brand' }]
    };
    const target: Target = {
      query: 'potatoe',
      hits: 10
    };
    const schema: Schema<Source, Target> = {
      // eslint-disable-next-line @typescript-eslint/no-extra-parens
      query: ({ q }, context) => (context?.endpoint?.match(/search/gi) ? q : ''),
      hits: 'rows'
    };

    const mapper = mapperFactory(schema);
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

    const mapper = mapperFactory(schema);
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

    const mapper = mapperFactory(schema);
    expect(mapper(source, { requestParameters: { addNumFound: 2 } })).toStrictEqual(target);
  });
});
