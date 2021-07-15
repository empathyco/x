import { A, B, C, D, E, E0, E1, F, G, H, H0, H1, I0, I1 } from '../__mocks__/container-config-parser.mocks';
import { ContainerConfigParser } from '../container/container-config-parser';

it('Binds shallow configurations', () => {
  const container = new ContainerConfigParser({
    a: A,
    b: B
  }).parse();
  const a = container.get<A>('a');
  const b = container.get<B>('b');

  expect(a).toBeInstanceOf(A);
  expect(b).toBeInstanceOf(B);
});

it('Injects deep bindings successfully', () => {
  const container = new ContainerConfigParser({
    a: A,
    c: C,
    d: D
  }).parse();
  const c = container.get<C>('c');

  expect(c).toBeInstanceOf(C);
  expect(c.d).toBeInstanceOf(D);
  expect(c.d.a).toBeInstanceOf(A);
});

it('Binds multiple implementations', () => {
  const container = new ContainerConfigParser({
    e: [E0, E1]
  }).parse();
  const e = container.getAll<E>('e');

  expect(e[0]).toBeInstanceOf(E0);
  expect(e[1]).toBeInstanceOf(E1);
});

it('Binds constant values', () => {
  const object = { msg: 'Eat more vegetables!' };
  const string = 'Don\'t do drugs';
  const array = ['Do', 'exercise'];
  const container = new ContainerConfigParser({
    object: { toConstant: object },
    string: { toConstant: string },
    array: { toConstant: array }
  }).parse();

  expect(container.get('object')).toBe(object);
  expect(container.get('string')).toBe(string);
  expect(container.get('array')).toBe(array);
});

it('Binds dynamic values', () => {
  let counter = 0;
  const container = new ContainerConfigParser({
    f: F,
    g: G,
    e: { toDynamic: () => counter++ }
  }).parse();

  expect(container.get<F>('f').e[0]).toBe(0);
  expect(container.get<G>('g').e[0]).toBe(1);
});

it('Binds contextual bindings related to parent', () => {
  const container = new ContainerConfigParser({
    f: F,
    e: { default: E1, whenInjectedInto: { f: E0 } },
    g: G
  }).parse();
  const f = container.get<F>('f');
  const g = container.get<G>('g');

  expect(f).toBeInstanceOf(F);
  expect(f.e[0]).toBeInstanceOf(E1);
  expect(f.e[1]).toBeInstanceOf(E0);
  expect(g.e).toHaveLength(1);
  expect(f.e[0]).toBeInstanceOf(E1);
});

it('Binds contextual bindings related to ancestors', () => {
  const container = new ContainerConfigParser({
    h0: H0,
    h1: H1,
    i: I0,
    e: { default: E0, whenAnyAncestorIs: { h0: E1 } }
  }).parse();

  const h0 = container.get<H>('h0');
  const h1 = container.get<H>('h1');

  expect(h0.i.e).toHaveLength(2);
  expect(h1.i.e).toHaveLength(1);
  expect((h0.i as I0).e[1]).toBeInstanceOf(E1);
  expect((h0.i as I0).e[0]).toBeInstanceOf(E0);
  expect((h1.i as I0).e[0]).toBeInstanceOf(E0);
});

it('Binds constants when injected into parent', () => {
  const container = new ContainerConfigParser({
    i: {
      toConstantWhenInjectedInto: {
        h0: 0,
        h1: 1
      }
    },
    h0: H0,
    h1: H1
  }).parse();

  const h0 = container.get<H>('h0');
  const h1 = container.get<H>('h1');

  expect(h0.i).toEqual(0);
  expect(h1.i).toEqual(1);
});

it('Binds constants when injected into any ancestors', () => {
  const container = new ContainerConfigParser({
    e: {
      toConstantWhenAnyAncestorIs: {
        h0: 0,
        h1: 1
      }
    },
    i: I1,
    h0: H0,
    h1: H1
  }).parse();

  const h0 = container.get<H>('h0');
  const h1 = container.get<H>('h1');

  expect(h0.i.e).toEqual(0);
  expect(h1.i.e).toEqual(1);
});
