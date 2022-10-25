import { ExtractArrayItems } from '../utils.types';

describe('ExtractArrayItems', () => {
  it('only allows string values from the given array', () => {
    const elements = ['prop1', 'prop2'] as const;
    let test: ExtractArrayItems<typeof elements>;
    // @ts-expect-error to check that the type only allows the desired values
    test = 'some other string';
    // @ts-expect-error to check that the type only allows the desired values
    test = 6;
    // @ts-expect-error to check that the type only allows the desired values
    test = {};
    test = 'prop1';
    expect(test).toEqual('prop1');
    test = 'prop2';
    expect(test).toEqual('prop2');
  });

  it('only allows number values from the given array', () => {
    const numbers = [0, 1, 2, 3] as const;
    let test: ExtractArrayItems<typeof numbers>;
    // @ts-expect-error to check that the type only allows the desired values
    test = 'some other string';
    // @ts-expect-error to check that the type only allows the desired values
    test = 6;
    // @ts-expect-error to check that the type only allows the desired values
    test = {};
    test = 0;
    expect(test).toEqual(0);
    test = 3;
    expect(test).toEqual(3);
  });

  it('only allows object values from the given array', () => {
    const cities = [{ name: 'Vigo' }, { name: 'Gijón' }, { name: 'Coruña' }] as const;
    let test: ExtractArrayItems<typeof cities>;
    // @ts-expect-error to check that the type only allows the desired values
    test = 'some other string';
    // @ts-expect-error to check that the type only allows the desired values
    test = 6;
    // @ts-expect-error to check that the type only allows the desired values
    test = {};
    // @ts-expect-error to check that the type only allows the desired values
    test = { name: 'Oviedo' };
    // @ts-expect-error to check that the type only allows the desired values
    test = { name: 'Vigo', people: 8 };
    test = { name: 'Vigo' };
    expect(test).toEqual({ name: 'Vigo' });
    test = { name: 'Coruña' };
    expect(test).toEqual({ name: 'Coruña' });
  });
});
