import { PropertyPath, PropertyType } from '../types';

interface Example {
  anString: string;
  aNumber: number;
  anObject: {
    something: {
      deep: boolean;
    };
  };
  anArray: { property: string }[];
  record: Record<string, { property: string }>;
  // recursive: Example;
  complexUnion: number | { property: string };
  unknown: unknown;
  optional?: { property: string };
}

/**
 * The following tests might look like silly ones that are not doing anything at all. However,
 * even if the assertions are not useful the goal of having them is to trigger typescript to check
 * the types are valid. So if we refactor the types and break something typescript will complain
 * when running the tests, and they will fail.
 */
describe('PropertyPath', () => {
  it('Safe types the string path to a property', () => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    const test: PropertyPath<Example>[] = [
      'anString',
      // 'recursive.anString', // Recursive navigation. Nice to have.
      'anObject.something.deep',
      'anArray.0',
      'anArray.0.property', // I think this is a requirement for this PR.
      'record.randomKey',
      'unknown',
      'complexUnion.property', // Navigate through union properties. Nice to have.
      'optional.property',
      // @ts-expect-error
      'nonexistent',
      // @ts-expect-error
      'anString.',
      // @ts-expect-error
      'unknown.something',
      // @ts-expect-error
      'unknown.',
      // @ts-expect-error
      'complexUnion.toFixed'
    ];
    expect(test[0]).toBe('user');
  });
});

describe('PropertyType', () => {
  it('Returns the type for a given property', () => {
    type bool = PropertyType<Example, 'anObject.something.deep'>;
    const test: bool = true;
    expect(test).toBe(true);

    type arrayOfObjects = PropertyType<Example, 'anArray'>;
    const testArray: arrayOfObjects = [{ property: 'test' }];
    expect(testArray[0].property).toBe('test');

    type complexUnion = PropertyType<Example, 'complexUnion'>;
    let testComplexUnion: complexUnion = 0;
    expect(testComplexUnion).toBe(0);
    testComplexUnion = { property: 'str' };
    expect(testComplexUnion.property).toBe('str');
  });
});
