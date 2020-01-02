import { forEach } from './object';

it('Iterates through object properties', () => {
  const obj = { a: 1, b: true, c: 'hello', d: [], e: {}, f: () => {} };
  const callback = jest.fn();

  forEach(obj, callback);

  expect(callback).toHaveBeenCalledTimes(6);
  expect(callback).toHaveBeenCalledWith('a', obj.a, expect.any(Number));
  expect(callback).toHaveBeenCalledWith('b', obj.b, expect.any(Number));
  expect(callback).toHaveBeenCalledWith('c', obj.c, expect.any(Number));
  expect(callback).toHaveBeenCalledWith('d', obj.d, expect.any(Number));
  expect(callback).toHaveBeenCalledWith('e', obj.e, expect.any(Number));
  expect(callback).toHaveBeenCalledWith('f', obj.f, expect.any(Number));
});

it('Does not iterate through undefined values', () => {
  const obj = { a: 0, b: false, c: '', d: null, e: undefined };
  const callback = jest.fn();

  forEach(obj, callback);

  expect(callback).toHaveBeenCalledTimes(4);
  expect(callback).toHaveBeenCalledWith('a', obj.a, expect.any(Number));
  expect(callback).toHaveBeenCalledWith('b', obj.b, expect.any(Number));
  expect(callback).toHaveBeenCalledWith('c', obj.c, expect.any(Number));
  expect(callback).toHaveBeenCalledWith('d', obj.d, expect.any(Number));
});

it('Does not iterate through not owned properties', () => {
  class Person {
    constructor(
      public name: string
    ) {}
  }

  (Person.prototype as any).inheritedProperty = 'Inherited property';
  const person = new Person('Eusebio');
  const callback = jest.fn();

  forEach(person, callback);

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith('name', person.name, expect.any(Number));
});

it('Does not iterate if the object is null', () => {
  const callback = jest.fn();

  forEach(null, callback);

  expect(callback).not.toHaveBeenCalled();
});

it('Does not iterate if the object is undefined', () => {
  const callback = jest.fn();

  forEach(undefined, callback);

  expect(callback).not.toHaveBeenCalled();
});
