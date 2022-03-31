import { Schema } from '../../schemas/schemas.types';
import { mapperFactory } from '../mapper.factory';

describe('identityMapper tests', () => {
  it('maps an entity to itself', () => {
    const source = {
      title: 'Hola',
      results: '',
      price: {
        min: 50,
        max: 70
      },
      facets: {
        name: 'Hola',
        count: 23423
      }
    };

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
      }
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
      }
    };

    const mapper = mapperFactory(schema);
    expect(mapper(source, {})).toStrictEqual(target);
  });

  it('self itself', () => {
    const source = {
      facets: {
        name: 'hola',
        count: 123
      }
    };

    const target = {
      filter: {
        id: 'hola',
        numFound: 123,
        child: {
          id: 'hola',
          numFound: 123
        },
        patata: {
          id: 'hola',
          numFound: 123
        }
      }
    };

    const schema: Schema<typeof source, typeof target> = {
      filter: {
        id: 'facets.name',
        numFound: 'facets.count',
        child: {
          $path: 'facets',
          $subschema: '$self'
        },
        patata: {
          $path: 'facets',
          $subschema: '$self'
        }
      }
    };

    const mapper = mapperFactory(schema);
    expect(mapper(source, {})).toStrictEqual(target);
  });
});
