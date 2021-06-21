import { deepMerge, deepMergeBehaviour, replaceBehaviour } from '../deep-merge';

describe('deep-merge.ts', () => {
  it('copies simple objects', () => {
    const target: any = {};
    const source: any = { a: 1, b: '2', c: true, d: null, e: undefined };
    deepMerge(target, source);
    expect(target).toEqual(source);
  });

  it('overrides with null and undefined values', () => {
    const target: any = { a: 1, b: 1 };
    const source: any = { a: null, b: undefined };
    deepMerge(target, source);
    expect(target).toEqual(source);
  });

  it('clones deep objects', () => {
    const target: any = {};
    const source: any = { a: { b: { c: 1 } } };
    deepMerge(target, source);
    expect(target.a.b).not.toBe(source.a.b);
    expect(target).toEqual(source);
  });

  it('assigns objects value in received order', () => {
    const target: any = {};
    const firstSource: any = { a: 1 };
    const secondSource: any = { a: 2 };
    const thirdSource: any = { a: 3 };
    deepMerge(target, firstSource, secondSource, thirdSource);
    expect(target.a).toEqual(thirdSource.a);
  });

  it('assigns all values from sources without mutating them', () => {
    const target: any = {};
    const firstSource: any = { a: { value: 1 } };
    const secondSource: any = { b: { value: 2 } };
    const thirdSource: any = { c: { value: 3 } };
    deepMerge(target, firstSource, secondSource, thirdSource);
    expect(firstSource).not.toHaveProperty('b');
    expect(firstSource).not.toHaveProperty('c');
    expect(secondSource).not.toHaveProperty('c');
    expect(target).toEqual({
      a: { value: 1 },
      b: { value: 2 },
      c: { value: 3 },
    });
  });

  it('overrides deeply nested objects', () => {
    const target: any = {};
    const firstSource: any = { a: { value: 1 } };
    const secondSource: any = { b: { value: 2 } };
    const thirdSource: any = { a: { value: 3 } };
    deepMerge(target, firstSource, secondSource, thirdSource);
    expect(target).toEqual({
      a: { value: 3 },
      b: { value: 2 },
    });
  });

  it('extends deeply nested objects', () => {
    const target: any = {};
    const firstSource: any = { a: { value: 1 } };
    const secondSource: any = { a: { newValue: 2 } };
    deepMerge(target, firstSource, secondSource);
    expect(target).toEqual({
      a: { value: 1, newValue: 2 },
    });
  });

  it('clones and replaces arrays', () => {
    const target: any = { arr: [1, 2, 3] };
    const source: any = { arr: [4, 5] };
    deepMerge(target, source);
    expect(target).toEqual({ arr: [4, 5] });
    expect(target.arr).not.toBe(source.arr);
  });

  it('modifies the target', () => {
    const target: any = {};
    const source: any = { a: { b: { c: 1 } } };
    const returnedTarget = deepMerge(target, source);
    expect(returnedTarget).toBe(target);
  });

  it('does nothing and does not crash if a source object is undefined or null', () => {
    const target = { a: 1 };
    const firstSource = undefined;
    const secondSource = null;
    const thirdSource = { a: 2, b: 3 };
    deepMerge(target, firstSource, secondSource, thirdSource);
    expect(target).toEqual({ a: 2, b: 3 });
  });

  it('removes target object properties if they are `undefined` in the source object', () => {
    const target = {
      a: 1,
      b: 'b',
      c: [1, 2, 3],
      d: { d1: 5 },
      f: { f1: 'f1', f2: 'f2' },
    };
    const firstSource = { a: undefined, b: undefined };
    const secondSource = { c: undefined, d: undefined };
    const thirdSource = { f: { f1: undefined, f2: 'f2' } };
    deepMerge(target, firstSource, secondSource, thirdSource);
    expect(target).toEqual({ f: { f2: 'f2' } });
  });

  it('does not remove target object properties if they are `null` in the source object', () => {
    const target = { a: 1, b: 'b', c: [1, 2, 3], d: { d1: 5 } };
    const firstSource = { a: null, b: undefined };
    const secondSource = { c: null, d: undefined };
    deepMerge(target, firstSource, secondSource);
    expect(target).toEqual({ a: null, c: null });
  });

  it('merges into a new object if target is undefined', () => {
    const target = undefined;
    const firstSource = { a: 1, b: 2 };
    const result = deepMerge(target, firstSource);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('fully replaces object if replace behaviour is selected on source object', () => {
    const target = { children: { a: 1, b: 2, c: 3 } };
    const firstSource = { children: replaceBehaviour({ c: 4, d: 5 }) };
    deepMerge(target, firstSource);
    expect(target).toEqual({ children: { c: 4, d: 5 } });
  });

  it('makes a copy of the object when replacing, to avoid unexpected modifications', () => {
    const target = { children: { a: 1, b: 2, c: 3 } };
    const firstSource = { children: replaceBehaviour({ c: 4, d: 5 }) };
    deepMerge(target, firstSource);
    expect(target.children).not.toBe(firstSource.children);
  });

  it("passes replace behaviour to the sources objects if it's present in target object", () => {
    const target = { children: replaceBehaviour({ a: 1, b: 2, c: 3 }) };
    const firstSource = { children: { c: 4, d: 5 } };
    const secondSource = { children: { e: 5, f: 6 } };
    deepMerge(target, firstSource, secondSource);
    expect(target).toEqual({ children: { e: 5, f: 6 } });
  });

  // eslint-disable-next-line max-len
  it('stops passing replace behaviour to the sources objects if deep-merge behaviour is specified', () => {
    const target = { children: replaceBehaviour({ a: 1, b: 2, c: 3 }) };
    const firstSource = { children: deepMergeBehaviour({ c: 4, d: 5 }) };
    const secondSource = { children: { e: 5, f: 6 } };
    deepMerge(target, firstSource, secondSource);
    expect(target).toEqual({
      children: { a: 1, b: 2, c: 4, d: 5, e: 5, f: 6 },
    });
  });

  it('replaces the target which contains a function', () => {
    const target = { a: () => undefined };
    deepMerge(target, { a: { a1: 'h1' } });
    expect(target).toEqual({ a: { a1: 'h1' } });
  });

  it('replaces the target which contains a string', () => {
    const target = { a: 'test' };
    deepMerge(target, { a: { a1: 'h1' } });
    expect(target).toEqual({ a: { a1: 'h1' } });
  });

  it('replaces the target which contains a boolean', () => {
    const target = { a: true };
    deepMerge(target, { a: { a1: 'h1' } });
    expect(target).toEqual({ a: { a1: 'h1' } });
  });

  it('replaces the target which contains a number', () => {
    const target = { a: 123 };
    deepMerge(target, { a: { a1: 'h1' } });
    expect(target).toEqual({ a: { a1: 'h1' } });
  });
});
