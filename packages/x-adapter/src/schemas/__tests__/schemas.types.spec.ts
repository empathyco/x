import { Schema } from '../schemas.types';

describe('Schema', () => {
  interface Source {
    data: {
      a: string;
      b: number;
    };
    facets: {
      filter: string;
      count: number;
    };
    price: {
      original: number;
      sale: number;
    };
    list: { id: string }[];
  }

  interface Target {
    count: number;
    filter: {
      value: string;
      num: number;
    };
    price: {
      hasDiscount: boolean;
      discountPercentage: number;
      original: number;
      discounted: number;
    };
    name: {
      title: string;
    };
  }

  it('Returns an schema', () => {
    const priceSchema: Schema<Source['price'], Target['price']> = {
      // eslint-disable-next-line @typescript-eslint/no-extra-parens
      hasDiscount: (_, context) => (context.requestParameters?.q === 'potatoe' ? false : true),
      discountPercentage: source => (1 - source.original / source.sale) * 100,
      original: 'original',
      discounted: 'sale'
    };

    const schema: Schema<Source, Target> = {
      count: source => Math.min(0, source.data.b),
      filter: {
        $path: 'facets',
        $subschema: {
          num: 'count',
          value: 'filter'
        }
      },
      price: {
        $path: 'price',
        $subschema: priceSchema
      },
      name: {
        // @ts-expect-error
        title: 'data.b'
      }
    };

    expect(typeof schema).toBe('object');
  });
});
