import { forEach, map, reduce } from '../object';

class Person {
  constructor(public name: string) {}
}

(Person.prototype as any).inheritedProperty = 'Inherited property';

beforeEach(jest.clearAllMocks);
describe('forEach', () => {
  const forEachCallback = jest.fn();

  it('Iterates through object properties', () => {
    const obj = { a: 1, b: true, c: 'hello', d: [], e: {}, f: () => {} };

    forEach(obj, forEachCallback);

    expectForEachToHaveBeenCalledWithValidParameters(obj);
    expectForEachCallsToHaveValidIndexParameter();
  });

  it('Does not iterate through undefined values', () => {
    const obj = { a: 0, b: false, c: '', d: null, e: undefined };

    forEach(obj, forEachCallback);

    const { e, ...objToIterate } = obj;
    expectForEachToHaveBeenCalledWithValidParameters(objToIterate);
    expectForEachCallsToHaveValidIndexParameter();
    expect(forEachCallback).not.toHaveBeenCalledWith(
      'e',
      obj.e,
      expect.any(Number)
    );
  });

  it('Does not iterate through not owned properties', () => {
    const person = new Person('Eusebio');

    forEach(person, forEachCallback);

    expect(forEachCallback).toHaveBeenCalledTimes(1);
    expect(forEachCallback).toHaveBeenCalledWith(
      'name',
      person.name,
      expect.any(Number)
    );
  });

  it('Does not iterate if the object is null', () => {
    forEach(null, forEachCallback);

    expect(forEachCallback).not.toHaveBeenCalled();
  });

  it('Does not iterate if the object is undefined', () => {
    forEach(undefined, forEachCallback);

    expect(forEachCallback).not.toHaveBeenCalled();
  });

  function expectForEachToHaveBeenCalledWithValidParameters(
    obj: {},
    callback = forEachCallback
  ) {
    const objEntries = Object.entries(obj);
    expect(callback).toHaveBeenCalledTimes(objEntries.length);
    expect(objEntries).toHaveLength(objEntries.length);
    objEntries.forEach(([prop, value]) => {
      expect(callback).toHaveBeenCalledWith(prop, value, expect.any(Number));
    });
  }

  function expectForEachCallsToHaveValidIndexParameter(
    callback = forEachCallback
  ) {
    callback.mock.calls
      .map(function selectIndexParameter(call) {
        return call[2];
      }) // 3rd parameter of the forEach call is the index
      .sort(function sortIndexAscending(i1, i2) {
        return i1 - i2;
      }) // Sort them from lower to higher index
      .forEach((forEachIndex, index) => {
        expect(forEachIndex).toBeGreaterThanOrEqual(index);
      });
  }
});

describe('reduce', () => {
  const reducer = jest.fn(
    (count: number, propertyName: string, propertyValue) =>
      count + (propertyValue ? 1 : 0)
  ); // Counts truthy properties
  it('Iterates through object properties', () => {
    const obj = { a: 1, b: true, c: 'hello', d: [], e: {}, f: () => {} };

    const result = reduce(obj, reducer, 0);

    expect(result).toEqual(6);
    expectReduceToHaveBeenCalledWithValidParameters(obj);
    expectReduceCallsToHaveValidIndexParameter();
  });

  it('Does not iterate through undefined values', () => {
    const obj = { a: 0, b: false, c: '', d: null, e: undefined };

    const result = reduce(obj, reducer, 0);

    const { e, ...objToIterate } = obj;
    expect(result).toEqual(0);
    expectReduceToHaveBeenCalledWithValidParameters(objToIterate);
    expectReduceCallsToHaveValidIndexParameter();
    expect(reducer).not.toHaveBeenCalledWith('e', obj.e, expect.any(Number));
  });

  it('Does not iterate through not owned properties', () => {
    const person = new Person('Eusebio');

    const result = reduce(person, reducer, 0);

    expect(result).toEqual(1);
    expect(reducer).toHaveBeenCalledTimes(1);
    expect(reducer).toHaveBeenCalledWith(
      0,
      'name',
      person.name,
      expect.any(Number)
    );
  });

  it('Does not iterate if the object is null', () => {
    const result = reduce(null, reducer, 0);

    expect(result).toEqual(0);
    expect(reducer).not.toHaveBeenCalled();
  });

  it('Does not iterate if the object is undefined', () => {
    const result = reduce(undefined, reducer, 0);

    expect(result).toEqual(0);
    expect(reducer).not.toHaveBeenCalled();
  });

  function expectReduceToHaveBeenCalledWithValidParameters(
    obj: {},
    callback: jest.Mock = reducer
  ) {
    const objEntries = Object.entries(obj);
    expect(callback).toHaveBeenCalledTimes(objEntries.length);
    expect(objEntries).toHaveLength(objEntries.length);
    objEntries.forEach(([prop, value]) => {
      expect(callback).toHaveBeenCalledWith(
        expect.any(Number),
        prop,
        value,
        expect.any(Number)
      );
    });
  }

  function expectReduceCallsToHaveValidIndexParameter(
    callback: jest.Mock = reducer
  ) {
    callback.mock.calls
      .map(function selectIndexParameter(call) {
        return call[3];
      }) // 4th parameter of the reduce call is the index
      .sort(function sortIndexAscending(i1, i2) {
        return i1 - i2;
      }) // Sort them from lower to higher index
      .forEach((forEachIndex, index) => {
        expect(forEachIndex).toBeGreaterThanOrEqual(index);
      });
  }
});

describe('map', () => {
  const mapCallback = jest.fn(
    (propertyName: string, propertyValue: any) => !!propertyValue
  ); // Transform each property to a boolean

  it('Iterates through object properties', () => {
    const obj = { a: 1, b: true, c: 'hello', d: [], e: {}, f: () => {} };

    const result = map(obj, mapCallback);

    expect(result).toEqual({
      a: true,
      b: true,
      c: true,
      d: true,
      e: true,
      f: true
    });
    expectMapToHaveBeenCalledWithValidParameters(obj);
    expectMapCallsToHaveValidIndexParameter();
  });

  it('Does not iterate through undefined values', () => {
    const obj = { a: 0, b: false, c: '', d: null, e: undefined };

    const result = map(obj, mapCallback);

    const { e, ...objToIterate } = obj;
    expect(result).toEqual({ a: false, b: false, c: false, d: false });
    expectMapToHaveBeenCalledWithValidParameters(objToIterate);
    expectMapCallsToHaveValidIndexParameter();
    expect(mapCallback).not.toHaveBeenCalledWith(
      'e',
      obj.e,
      expect.any(Number)
    );
  });

  it('Does not iterate through not owned properties', () => {
    const person = new Person('Eusebio');

    const result = map(person, mapCallback);

    expect(result).toEqual({ name: true });
    expect(mapCallback).toHaveBeenCalledTimes(1);
    expect(mapCallback).toHaveBeenCalledWith(
      'name',
      person.name,
      expect.any(Number)
    );
  });

  it('Does not iterate if the object is null', () => {
    const result = map(null, mapCallback);

    expect(result).toEqual({});
    expect(mapCallback).not.toHaveBeenCalled();
  });

  it('Does not iterate if the object is undefined', () => {
    const result = map(undefined, mapCallback);

    expect(result).toEqual({});
    expect(mapCallback).not.toHaveBeenCalled();
  });

  function expectMapToHaveBeenCalledWithValidParameters(
    obj: {},
    callback: jest.Mock = mapCallback
  ) {
    const objEntries = Object.entries(obj);
    expect(callback).toHaveBeenCalledTimes(objEntries.length);
    expect(objEntries).toHaveLength(objEntries.length);
    objEntries.forEach(([prop, value]) => {
      expect(callback).toHaveBeenCalledWith(prop, value, expect.any(Number));
    });
  }

  function expectMapCallsToHaveValidIndexParameter(
    callback: jest.Mock = mapCallback
  ) {
    callback.mock.calls
      .map(function selectIndexParameter(call) {
        return call[2];
      }) // 3rd parameter of the forEach call is the index
      .sort(function sortIndexAscending(i1, i2) {
        return i1 - i2;
      }) // Sort them from lower to higher index
      .forEach((forEachIndex, index) => {
        expect(forEachIndex).toBeGreaterThanOrEqual(index);
      });
  }
});
