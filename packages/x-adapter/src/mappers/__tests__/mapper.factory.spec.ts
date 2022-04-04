import { ExtractType } from '@empathyco/x-utils';
import { Schema } from '../../schemas/schemas.types';
import { mapperFactory } from '../mapper.factory';

describe('mapperFactory tests', () => {
  const source = {
    title: 'Hola',
    price: {
      min: 50,
      max: 70
    },
    facets: {
      name: 'Hola',
      count: 23423
    },
    matches: [
      { name: 'result1', visits: 1, img: 'https://www.empathy.co/result/1' },
      { name: 'result2', visits: 2, img: 'https://www.empathy.co/result/2' }
    ]
  };

  it('creates a mapper function that applies the given schema', () => {
    const target = {
      name: 'Hola',
      minPrice: 50,
      maxPrice: 69,
      filter: {
        numFound: 23423,
        id: 'Hola',
        child: {
          numFound: 23423
        }
      },
      results: [
        { id: 'result1', hits: 1, image: 'https://www.empathy.co/result/1' },
        { id: 'result2', hits: 2, image: 'https://www.empathy.co/result/2' }
      ]
    };

    const schema: Schema<typeof source, typeof target> = {
      name: 'title',
      minPrice: 'price.min',
      maxPrice: ({ price }) => price.max - 1,
      filter: {
        numFound: 'facets.count',
        id: 'facets.name',
        child: {
          numFound: 'facets.count'
        }
      },
      results: {
        $path: 'matches',
        $subschema: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          id: 'name',
          hits: 'visits',
          image: 'img'
        }
      }
    };

    const mapper = mapperFactory(schema);
    expect(mapper(source, {})).toStrictEqual(target);
  });

  it('creates a mapper function that applies the given schema recursively', () => {
    const source2 = {
      facets: {
        name: 'soy un facet',
        count: 23423,
        filters: [
          {
            name: 'soy un filter',
            children: [
              {
                name: 'soy un filter hijo',
                children: [
                  {
                    name: 'soy un filter nieto'
                  }
                ]
              }
            ]
          }
        ]
      }
    };

    const target = {
      facet: {
        id: 'soy un facet',
        filters: [
          {
            id: 'soy un filter',
            numFound: 2,
            filters: [
              {
                id: 'soy un filter hijo',
                numFound: 2,
                filters: [
                  {
                    id: 'soy un filter nieto',
                    numFound: 2
                  }
                ]
              }
            ]
          }
        ]
      }
    };

    const filtersSchema: Schema<
      ExtractType<typeof source2, 'facets.filters.0'>,
      {
        id: string;
        numFound: number;
        filters: Array<{
          id: string;
          numFound: number;
          filters: Array<{ id: string; numFound: number }>;
        }>;
      }
    > = {
      id: 'name',
      numFound: () => 2,
      filters: {
        $path: 'children',
        $subschema: '$self'
      }
    };

    const schema: Schema<typeof source2, typeof target> = {
      facet: {
        id: 'facets.name',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        filters: {
          $path: 'facets.filters',
          $subschema: filtersSchema
        }
      }
    };

    const mapper = mapperFactory(schema);
    expect(mapper(source2, {})).toStrictEqual(target);
  });
});
