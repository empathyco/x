import { isObject } from '../../object';

describe('utils.types test', () => {
  it('should be true when object', () => {
    const array = [1, 2, 3];
    const object = {
      id: 1,
      name: 'test',
      array
    };
    const testFunction = (): boolean => true;

    expect(isObject(object)).toBe(true);
    expect(isObject(array)).toBe(false);
    expect(isObject(testFunction)).toBe(false);
  });
});
