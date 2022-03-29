import { TreeShakeObject } from '../object.types';

interface Example {
  stringKey: string;
  optionalStringKey?: string;
  numberKey: number;
  booleanKey: boolean;
  objectKey: {
    innerStringKey: string;
  };
}

/* eslint-disable @typescript-eslint/ban-ts-comment */

describe('TreeShakeObject', () => {
  it('Returns a tree-shaken object with the keys that match the given type', () => {
    const test: TreeShakeObject<Example, string> = {
      objectKey: {
        innerStringKey: 'inner'
      },
      stringKey: 'hi',
      optionalStringKey: 'optional',
      // @ts-expect-error
      booleanKey: false
    };

    expect(test).toMatchObject<TreeShakeObject<Example, string>>({
      ...test
    });
  });

  // eslint-disable-next-line max-len
  it('Returns a tree-shaken object with the keys that match the given type excluding optionals', () => {
    const test: TreeShakeObject<Example, string, true> = {
      objectKey: {
        innerStringKey: 'inner'
      },
      stringKey: 'hi'
      // TODO: Check how webstorm links tsconfig.json files to test files, as right now it is not
      //  using our tsconfig.json because we are excluding tests files to avoid including them in
      //  the build and types declarations.
      /*// @ts-expect-error
       optionalStringKey: 'optional'*/
    };

    expect(test).toMatchObject<TreeShakeObject<Example, string, true>>({
      ...test
    });
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */
