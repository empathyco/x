import { extractValue } from '../extract-value';

describe('testing extractValue function', () => {
  const someObject = {
    a: {
      b: {
        c: {
          d: 2
        },
        e: 'e'
      }
    },
    f: 1,
    g: [{ id: 'gid' }, 'random'],
    h: undefined,
    i: null
  };

  it("extracts the value of the given property's path from the given object", () => {
    expect(extractValue(someObject, 'a')).toBe(someObject.a);
    expect(extractValue(someObject, 'a.b')).toBe(someObject.a.b);
    expect(extractValue(someObject, 'a.b.c')).toBe(someObject.a.b.c);
    expect(extractValue(someObject, 'a.b.c.d')).toBe(someObject.a.b.c.d);
    expect(extractValue(someObject, 'a.b.e')).toBe(someObject.a.b.e);
    expect(extractValue(someObject, 'f')).toBe(someObject.f);
    expect(extractValue(someObject, 'g')).toBe(someObject.g);
    expect(extractValue(someObject, 'g.0')).toBe(someObject.g[0]);
    expect(extractValue(someObject, 'g.0.id')).toBe((someObject.g[0] as { id: string }).id);
    expect(extractValue(someObject, 'g.1')).toBe(someObject.g[1]);
    expect(extractValue(someObject, 'i')).toBeNull();
    expect(extractValue(someObject, 'h')).toBeUndefined();
  });

  it("returns undefined when the property's path is invalid", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(extractValue(someObject, 'invalid.path')).toBeUndefined();
  });
});
