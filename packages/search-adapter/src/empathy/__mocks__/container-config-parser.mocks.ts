import { inject, injectable, multiInject } from 'inversify';

@injectable()
export class A {}

@injectable()
export class B {}

@injectable()
export class C {
  @inject('d')
  public d!: D;
}

@injectable()
export class D {
  @inject('a')
  public a!: A;
}

// When injected into tests
export interface E {}

@injectable()
export class E0 implements E {}

@injectable()
export class E1 implements E {}

@injectable()
export class F {
  @multiInject('e') e!: E[];
}

@injectable()
export class G {
  @multiInject('e') e!: E[];
}

// When any ancestor is tests
export interface H {
  i: I;
}

@injectable()
export class H0 implements H {
  @inject('i') i!: I;
}

@injectable()
export class H1 implements H {
  @inject('i') i!: I;
}

interface I {
  e: E | E[];
}

@injectable()
export class I0 {
  @multiInject('e') e!: E[];
}

@injectable()
export class I1 {
  @inject('e') e!: E[];
}
