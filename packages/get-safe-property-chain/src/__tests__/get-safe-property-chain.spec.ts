import { getSafePropertyChain } from '../get-safe-property-chain';

describe('testing getSafePropertyChain function', () => {
  it('retrieves shallow values', () => {
    const obj = { message: 'Hell yeah!' };
    const result = getSafePropertyChain(obj, 'message');
    expect(result).toBe(obj.message);
  });

  it('retrieves deep values', () => {
    const obj = { nestedObject: { anotherNestedObject: { message: 'Hell yeah!' } } };
    const result = getSafePropertyChain(obj, 'nestedObject.anotherNestedObject.message');
    expect(result).toBe(obj.nestedObject.anotherNestedObject.message);
  });

  it('returns "undefined" if the property chain is not found at level 1', () => {
    const obj = { nestedObject: { anotherNestedObject: { message: 'Fuck yeah!' } } };
    const result = getSafePropertyChain(obj, 'thisDoesNotExist.anotherNestedObject.message');
    expect(result).toBeUndefined();
  });

  it('returns "undefined" if the property chain is not found at any deepness level', () => {
    const obj = { nestedObject: { anotherNestedObject: { message: 'Hell yeah!' } } };
    const result = getSafePropertyChain(obj, 'nestedObject.anotherNestedObject.thisDoesNotExist');
    expect(result).toBeUndefined();
  });

  // eslint-disable-next-line max-len
  it('returns a default value if the property chain is not found and a default value has been provided', () => {
    const defaultReturn = 'TypeScript rules!';
    const obj = { nestedObject: { anotherNestedObject: { message: 'Fuck yeah!' } } };
    const result = getSafePropertyChain(
      obj,
      'nestedObject.anotherNestedObject.thisDoesNotExist',
      defaultReturn
    );
    expect(result).toBe(defaultReturn);
  });

  it('returns the object if an empty property chain has been passed', () => {
    const obj = { nestedObject: { anotherNestedObject: { message: 'Hell yeah!' } } };
    const result = getSafePropertyChain(obj, '');
    expect(result).toBe(obj);
  });

  it('works with falsy values', () => {
    const values = [false, 0, null, '', NaN];
    values.forEach(value => {
      const result = getSafePropertyChain({ value: value }, 'value');
      expect(result).toEqual(value);
    });
  });

  it('returns undefined if a middle result is null', () => {
    const obj = { grandpa: { parent: null } };
    const result = getSafePropertyChain(obj, 'grandpa.parent.child');
    expect(result).toBeUndefined();
  });
});
