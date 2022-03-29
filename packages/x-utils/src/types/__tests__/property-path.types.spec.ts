import { ExtractPaths, PropertyPath, PropertyType } from '../property-path.types';

interface Example {
  anString: string;
  aNumber: number;
  anObject: {
    something: {
      deep: boolean;
    };
  };
  anArray: { property: string }[];
  aNumberArray: number[];
  record: Record<'a' | 'b' | 'c', { property: string }>;
  complexUnion: number | { property: string };
  unknown: unknown;
  optional?: { property: string };
  recursive: Example;
  person: Person;
}

interface Person {
  name: string;
  address: {
    zipCode: string;
    street: string;
  };
  age: number;
  cars: { model: string; year: number }[];
  friends: Person[];
}

/**
 * The following tests might look like silly ones that are not doing anything at all. However,
 * the goal of having them is to trigger typescript to check that the types are valid,
 * even if the assertions are not useful. So if we refactor the types and break something
 * typescript will complain when running the tests, and they will fail.
 */
describe('PropertyPath', () => {
  it('Safe types the string path to a property', () => {
    const test: PropertyPath<Example>[] = [
      'anString',
      'anObject.something',
      'anObject.something.deep',
      'anArray.0',
      'anArray.0.property',
      'unknown',
      'record.b',
      'record.a.property',
      'complexUnion.property',
      'optional.property',
      'aNumberArray',
      'aNumberArray.0',
      'recursive.recursive',
      'person.cars.0.model',
      'person.friends.0.friends',
      // @ts-expect-error
      'anString.something',
      // @ts-expect-error
      'anObject.notKeyName',
      // @ts-expect-error
      'person.friends.4.notKeyName',
      // @ts-expect-error
      'recursive.notKeyName',
      // @ts-expect-error
      'record.notKeyName',
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
    expect(test[0]).toBe('anString');
  });
});

describe('PropertyType', () => {
  it('Returns the a boolean property', () => {
    type BooleanProperty = PropertyType<Example, 'anObject.something.deep'>;
    // @ts-expect-error
    let test: BooleanProperty = {};
    // @ts-expect-error
    test = 'some string';
    // @ts-expect-error
    test = 5;
    test = true;
    expect(typeof test).toBe('boolean');
  });

  it('Returns an array property', () => {
    type ArrayOfObjects = PropertyType<Example, 'anArray'>;
    // @ts-expect-error
    let testArray: ArrayOfObjects = {};
    // @ts-expect-error
    testArray = true;
    // @ts-expect-error
    testArray = 'some string';
    testArray = [{ property: 'test' }];
    expect(typeof testArray).toBe('object');
  });

  it('Returns a complex union property', () => {
    type NumberOrObjectWithProperty = PropertyType<Example, 'complexUnion'>;
    // @ts-expect-error
    let testComplexUnion: NumberOrObjectWithProperty = 'some string';
    // @ts-expect-error
    testComplexUnion = true;
    // @ts-expect-error
    testComplexUnion = [];
    testComplexUnion = 5;
    testComplexUnion = { property: 'str' };
    expect(typeof testComplexUnion).toBe('object');
  });

  it('Returns a recursive object', () => {
    type RecursiveObject = PropertyType<Example, 'recursive.recursive'>;
    // @ts-expect-error
    let testRecursiveObject: Partial<RecursiveObject> = true;
    // @ts-expect-error
    testRecursiveObject = 'some string';
    // @ts-expect-error
    testRecursiveObject = [];
    // @ts-expect-error
    testRecursiveObject = 5;
    testRecursiveObject = { anString: 'some string' };
    expect(typeof testRecursiveObject).toBe('object');
  });

  it('Returns a recursive number property', () => {
    type RecursiveFriendAge = PropertyType<
      Example,
      // eslint-disable-next-line max-len
      'person.friends.0.friends.1.friends.2.friends.3.friends.4.friends.5.friends.6.friends.7.friends.8.friends.9.friends.10.age'
    >;

    // @ts-expect-error
    let testRecursiveFriendAge: RecursiveFriendAge = {};
    // @ts-expect-error
    testRecursiveFriendAge = 'some string';
    // @ts-expect-error
    testRecursiveFriendAge = true;
    // @ts-expect-error
    testRecursiveFriendAge = [];
    testRecursiveFriendAge = 33;
    expect(typeof testRecursiveFriendAge).toBe('number');
  });

  it('Returns a recursive string property', () => {
    type RecursiveFriendName = PropertyType<
      Example,
      // eslint-disable-next-line max-len
      'person.friends.0.friends.1.friends.2.friends.3.friends.4.friends.5.friends.6.friends.7.friends.8.friends.9.friends.10.name'
    >;

    // @ts-expect-error
    let testRecursiveFriendName: RecursiveFriendName = {};
    // @ts-expect-error
    testRecursiveFriendName = 5;
    // @ts-expect-error
    testRecursiveFriendName = true;
    testRecursiveFriendName = 'some name';
    expect(typeof testRecursiveFriendName).toBe('string');
  });

  it('Returns a deep recursive array item', () => {
    type RecursiveFriend = PropertyType<
      Example,
      // eslint-disable-next-line max-len
      'person.friends.0.friends.1.friends.2.friends.3.friends.4.friends.5.friends.6.friends.7.friends.8.friends.9.friends.10'
    >;

    // @ts-expect-error
    let testRecursiveFriend: Partial<RecursiveFriend> = 5;
    // @ts-expect-error
    testRecursiveFriend = true;
    // @ts-expect-error
    testRecursiveFriend = { randomKey: 5 };
    testRecursiveFriend = { name: 'Some team' };
    expect(typeof testRecursiveFriend).toBe('object');
  });
});

describe('ExtractPaths', () => {
  interface PathsExample {
    stringKey: string;
    optionalStringKey?: string;
    numberKey: number;
    booleanKey: boolean;
    objectKey: {
      innerStringKey: string;
    };
    functionKey: (random: any) => any;
    arrayKey: string[];
  }

  it('Extracts the property paths of the provided object that match the given type', () => {
    const test: (keyof ExtractPaths<PathsExample, string>)[] = [
      'stringKey',
      'objectKey.innerStringKey',
      // @ts-expect-error
      'optionalStringKey',
      // @ts-expect-error
      'numberKey',
      // @ts-expect-error
      'booleanKey',
      // @ts-expect-error
      'objectKey',
      // @ts-expect-error
      'functionKey',
      // @ts-expect-error
      'arrayKey'
    ];

    expect(typeof test).toBe('object');
  });
});
