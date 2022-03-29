import { PickByType } from '../object.types';

describe('PickByType', () => {
  interface Example {
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

  it('Picks the keys from the provided object that match the given type', () => {
    const test: PickByType<Example, string | undefined> = {
      objectKey: {
        innerStringKey: 'inner'
      },
      stringKey: 'hi',
      optionalStringKey: 'optional',
      // @ts-expect-error
      booleanKey: false
    };

    const anotherTest: PickByType<Example, string> = {
      objectKey: {
        innerStringKey: 'inner'
      },
      stringKey: 'hi',
      // @ts-expect-error
      booleanKey: false
    };

    const yetAnotherTest: PickByType<Example, string> = {
      objectKey: {
        innerStringKey: 'inner'
      },
      stringKey: 'hi',
      // @ts-expect-error
      functionKey: random => random
    };

    const andOneMore: PickByType<Example, string> = {
      objectKey: {
        innerStringKey: 'inner'
      },
      stringKey: 'hi',
      // @ts-expect-error
      arrayKey: ['potatoe']
    };

    const theLastOne: PickByType<Example, string> = {
      objectKey: {
        innerStringKey: 'inner'
      },
      stringKey: 'hi',
      // @ts-expect-error
      optionalStringKey: 'potatoe'
    };

    expect(typeof test).toBe('object');
    expect(typeof anotherTest).toBe('object');
    expect(typeof yetAnotherTest).toBe('object');
    expect(typeof andOneMore).toBe('object');
    expect(typeof theLastOne).toBe('object');
  });
});
