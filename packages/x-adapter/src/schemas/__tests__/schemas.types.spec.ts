import { Schema } from '../schemas.types';

/* eslint-disable @typescript-eslint/ban-ts-comment */

/**
 * The following tests might look like silly ones that are not doing anything at all. However,
 * the goal of having them is to trigger typescript to check that the types are valid,
 * even if the assertions are not useful. So if we refactor the types and break something
 * typescript will complain when running the tests, and they will fail.
 */
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
    list: { id: string }[];
  }

  interface Target {
    count: number;
    filter: {
      value: string;
      num: number;
    };
    name: {
      title: string;
    };
  }

  it('Returns an schema', () => {
    const schema: Schema<Source, Target> = {
      count: source => Math.min(0, source.data.b),
      filter: {
        $path: 'facets',
        $subschema: {
          num: 'count',
          value: 'filter'
        }
      },
      name: {
        // @ts-expect-error
        title: 'data.b'
      }
    };

    expect(typeof schema).toBe('object');
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */
