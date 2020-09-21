/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Primitive ? T[P] : DeepPartial<T[P]>;
};

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type Primitive = string | number | boolean | undefined | null | Symbol | Function;

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type Dictionary<T = any> = Record<string, T>;

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type Newable<T = any> = new (...args: any[]) => T;
