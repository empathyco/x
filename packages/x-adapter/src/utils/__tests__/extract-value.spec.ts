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
    expect(extractValue<typeof someObject>(someObject, 'a')).toBe(someObject.a);
    expect(extractValue<typeof someObject>(someObject, 'a.b')).toBe(someObject.a.b);
    expect(extractValue<typeof someObject>(someObject, 'a.b.c')).toBe(someObject.a.b.c);
    expect(extractValue<typeof someObject>(someObject, 'a.b.c.d')).toBe(someObject.a.b.c.d);
    expect(extractValue<typeof someObject>(someObject, 'a.b.e')).toBe(someObject.a.b.e);
    expect(extractValue<typeof someObject>(someObject, 'f')).toBe(someObject.f);
    expect(extractValue<typeof someObject>(someObject, 'g')).toBe(someObject.g);
    expect(extractValue<typeof someObject>(someObject, 'g.0')).toBe(someObject.g[0]);
    expect(extractValue<typeof someObject>(someObject, 'g.0.id')).toBe(
      (someObject.g[0] as { id: string }).id
    );
    expect(extractValue<typeof someObject>(someObject, 'g.1')).toBe(someObject.g[1]);
  });

  it("throws an error when the property's path is invalid or it has a nullish value", () => {
    expect(() => extractValue<typeof someObject>(someObject, 'h')).toThrowError(expect.anything());
    expect(() => extractValue<typeof someObject>(someObject, 'i')).toThrowError(expect.anything());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(() => extractValue<typeof someObject>(someObject, 'invalid.path')).toThrowError(
      expect.anything()
    );
  });
});
