import { extendedProps } from '../dynamic-props.mixin';

describe('extendedProps', () => {
  it('only allows values from the given array', () => {
    const elements = ['prop1', 'prop2'] as const;
    let test: extendedProps<typeof elements>;
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
});
