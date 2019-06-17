export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Primitive ? T[P] : DeepPartial<T[P]>;
};

export type Primitive = string | number | boolean | undefined | null | Symbol | Function;

export type Dictionary<T = any> = Record<string, T>;

export type Newable<T = any> = new (...args: any[]) => T;
