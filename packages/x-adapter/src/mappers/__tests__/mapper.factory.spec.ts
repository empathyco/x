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
      }
    };

    const target = {
      name: 'Hola',
      minPrice: 50,
      maxPrice: 71
    };

    const schema: Schema<typeof source, typeof target> = {
      name: 'title',
      minPrice: 'price.min',
      maxPrice: ({ price }) => price.max + 1
    };

    const mapper = mapperFactory(schema);

    expect(mapper(source, {})).toStrictEqual(target);
  });
});
