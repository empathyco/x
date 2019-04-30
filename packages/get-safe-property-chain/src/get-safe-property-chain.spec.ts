import { getSafePropertyChain } from './get-safe-property-chain';

describe('get-safe-property-chain.ts', () => {
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
    expect(result).toBe(undefined);
  });

  it('returns "undefined" if the property chain is not found at any deepness level', () => {
    const obj = { nestedObject: { anotherNestedObject: { message: 'Hell yeah!' } } };
    const result = getSafePropertyChain(obj, 'nestedObject.anotherNestedObject.thisDoesNotExist');
    expect(result).toBe(undefined);
  });

  it('returns a default value if the property chain is not found and a default value has been provided', () => {
    const defaultReturn = 'TypeScript rules!';
    const obj = { nestedObject: { anotherNestedObject: { message: 'Fuck yeah!' } } };
    const result = getSafePropertyChain(obj, 'nestedObject.anotherNestedObject.thisDoesNotExist', defaultReturn);
    expect(result).toBe(defaultReturn);
  });

  it('returns the object if an empty property chain has been passed', () => {
    const obj = { nestedObject: { anotherNestedObject: { message: 'Hell yeah!' } } };
    const result = getSafePropertyChain(obj, '');
    expect(result).toBe(obj);
  });
});
