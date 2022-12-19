import { getSafePropertyChain } from '../get-safe-property-chain';

describe('testing getSafePropertyChain function', () => {
  it('retrieves shallow values', () => {
    const obj = { message: 'Hell yeah!' };
    const result: string | undefined = getSafePropertyChain(obj, 'message');
    expect(result).toBe(obj.message);
  });

  it('retrieves deep values', () => {
    const obj = { nestedObject: { anotherNestedObject: { message: 'Hell yeah!' } } };
    const result: string | undefined = getSafePropertyChain(
      obj,
      'nestedObject.anotherNestedObject.message'
    );
    expect(result).toBe(obj.nestedObject.anotherNestedObject.message);
  });

  it('returns "undefined" if the property chain is not found at level 1', () => {
    const obj: any = { nestedObject: { anotherNestedObject: { message: 'Fuck yeah!' } } };
    const result: string | undefined = getSafePropertyChain(
      obj,
      'thisDoesNotExist.anotherNestedObject.message'
    );
    expect(result).toBeUndefined();
  });

  it('returns "undefined" if the property chain is not found at any deepness level', () => {
    const obj: any = { nestedObject: { anotherNestedObject: { message: 'Hell yeah!' } } };
    const result: string | undefined = getSafePropertyChain(
      obj,
      'nestedObject.anotherNestedObject.thisDoesNotExist'
    );
    expect(result).toBeUndefined();
  });

  // eslint-disable-next-line max-len
  it('returns a default value if the property chain is not found and a default value has been provided', () => {
    const defaultReturn = 'TypeScript rules!';
    const obj: any = { nestedObject: { anotherNestedObject: { message: 'Fuck yeah!' } } };
    const result: string | undefined = getSafePropertyChain(
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
    const obj: any = { grandpa: { parent: null } };
    const result = getSafePropertyChain(obj, 'grandpa.parent.child');
    expect(result).toBeUndefined();
  });

  it('works with arrays and indexes', () => {
    const obj = { anArray: [{ id: '1' }, { id: '2' }, { id: '3' }] };
    const result: string | undefined = getSafePropertyChain(obj, 'anArray.1.id');
    expect(result).toBe('2');
  });

  it('returns undefined the array is empty', () => {
    const obj = { anArray: [] };
    const result = getSafePropertyChain(obj, 'anArray.1');
    expect(result).toBeUndefined();
  });

  it('returns undefined if the index is not present in the array', () => {
    const obj = { anArray: [{ id: '1' }] };
    const result: { id: string } | undefined = getSafePropertyChain(obj, 'anArray.1');
    expect(result).toBeUndefined();
  });

  it('works with arrays with different type items', () => {
    const obj = { anArray: [{ id: '1' }, { name: 'element2' }] };
    const result: { id: string } | { name: string } | undefined = getSafePropertyChain(
      obj,
      'anArray.1'
    );
    expect(result).toEqual(obj.anArray[1]);
  });

  it('returns the value with proper type', () => {
    const obj = {
      anArray: ['value'],
      aNumber: 1,
      aString: '2',
      aBool: true,
      anObject: { child: 'string-child' }
    };
    const anArray: string[] | undefined = getSafePropertyChain(obj, 'anArray');
    const aNumber: number | undefined = getSafePropertyChain(obj, 'aNumber');
    const aString: string | undefined = getSafePropertyChain(obj, 'aString');
    const aBool: boolean | undefined = getSafePropertyChain(obj, 'aBool');
    const anObject: { child: string } | undefined = getSafePropertyChain(obj, 'anObject');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const anTypeError: string | undefined = getSafePropertyChain(obj, 'aNumber');

    expect(anArray).toEqual(['value']);
    expect(aNumber).toBe(1);
    expect(aString).toBe('2');
    expect(aBool).toBe(true);
    expect(anObject).toEqual({ child: 'string-child' });
    expect(anTypeError).toBe(1);
  });
});
