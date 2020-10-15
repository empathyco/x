import { arrayToObject, isArrayEmpty } from '../array';

describe(`testing ${isArrayEmpty.name} utility method`, () => {
  it('returns `true` when the array is `null`, `undefined` or has no elements', () => {
    expect(isArrayEmpty(undefined)).toEqual(true);
    expect(isArrayEmpty(null)).toEqual(true);
    expect(isArrayEmpty([])).toEqual(true);
  });

  it('returns `false` when the array contains at least 1 element', () => {
    expect(isArrayEmpty([null])).toEqual(false);
  });
});

describe(`testing ${arrayToObject.name} utility method`, () => {
  it('should return an object with the correct format from an array', () => {
    interface ArrayTypeMock {
      targetKey: string;
      p1: string;
      p2: string;
    }

    const arrayMock: ArrayTypeMock[] = [
      {
        targetKey: 'object1',
        p1: 'value1',
        p2: 'value2'
      },
      {
        targetKey: 'object2',
        p1: 'value3',
        p2: 'value4'
      }
    ];

    const dictMock: Record<string, ArrayTypeMock> = {
      object1: {
        targetKey: 'object1',
        p1: 'value1',
        p2: 'value2'
      },
      object2: {
        targetKey: 'object2',
        p1: 'value3',
        p2: 'value4'
      }
    };

    expect(arrayToObject(arrayMock, 'targetKey')).toEqual(dictMock);
  });
});
