import { clone } from '../clone';

describe('testing clone function', () => {
  it('clones shallow objects', () => {
    const object = { a: 1, b: 'test', c: true };
    const cloned = clone(object);

    expect(cloned).toEqual(object);
    expect(cloned).not.toBe(object);
  });

  it('clones shallow arrays', () => {
    const array = ['a', 1, true];
    const cloned = clone(array);

    expect(cloned).toEqual(array);
    expect(cloned).not.toBe(array);
  });

  it('clones deep objects', () => {
    const object = { a: { b: { c: [{ d: 1 }] } } } as const;

    const cloned = clone(object);

    expect(cloned).toEqual(object);
    expect(cloned).not.toBe(object);
    expect(cloned.a).not.toBe(object.a);
    expect(cloned.a.b).not.toBe(object.a.b);
    expect(cloned.a.b.c).not.toBe(object.a.b.c);
    expect(cloned.a.b.c[0]).not.toBe(object.a.b.c[0]);
  });

  it('clones deep arrays', () => {
    const array = [[{ a: 1 }], { b: 2 }] as const;
    const cloned = clone(array);

    expect(cloned).toEqual(array);
    expect(cloned).not.toBe(array);
    expect(cloned[0]).not.toBe(array[0]);
    expect(cloned[1]).not.toBe(array[1]);
  });
});
