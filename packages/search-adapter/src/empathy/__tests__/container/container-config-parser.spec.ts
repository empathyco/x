import { inject, injectable } from 'inversify';
import { parseConfig } from '../../container/container-config-parser';

describe('container-config-parser.ts', () => {
  it('Binds shallow configurations', () => {
    const container = parseConfig({
      a: { to: A },
      b: { to: B }
    });
    const a = container.get<A>('a');
    const b = container.get<B>('b');
    expect(a).toBeInstanceOf(A);
    expect(b).toBeInstanceOf(B);
  });

  it('Injects bindings successfully', () => {
    const container = parseConfig({
      a: { to: A },
      c: { to: C },
      d: { to: D }
    });
    const c = container.get<C>('c');
    expect(c).toBeInstanceOf(C);
    expect(c.d).toBeInstanceOf(D);
    expect(c.d.a).toBeInstanceOf(A);
  });

  it('Injects contextual bindings successfully', () => {
    const container = parseConfig({
      e: {
        to: E,
        dependencies: {
          f: { to: F2 }
        }
      },
      f: { to: F1 }
    });
    const e = container.get<E>('e');
    const f = container.get<F>('f');
    expect(e).toBeInstanceOf(E);
    expect(f).toBeInstanceOf(F1);
    expect(e.f).toBeInstanceOf(F2);
  });
});

@injectable()
class A {}

@injectable()
class B {}

@injectable()
class C {
  @inject('d')
  public d!: D;
}

@injectable()
class D {
  @inject('a')
  public a!: A;
}

interface F {}

@injectable()
class E {
  @inject('f')
  f!: F;
}

@injectable()
class F1 implements F {}

@injectable()
class F2 implements F {}
