/**
 * Picks the keys from the provided object that match the given type.
 *
 * @param SomeObject - The object to pick the keys from.
 * @param Type - The type of the properties to pick.
 *
 * @example
 * ```typescript
 * interface Result {
 *   id: string,
 *   price: {
 *     max: number,
 *     min: number,
 *     symbol: string;
 *   },
 *   images: string[]
 * }
 *
 * type ResultOnlyStrings = PickByType<Result, string>; // { id: string; price: { symbol: string; }}
 * type ResultOnlyNumbers = PickByType<Result, number>; // { price: { max: number; min: number; }}
 * ```
 *
 * @public
 */
export type PickByType<SomeObject, Type> = {
  [Property in keyof SomeObject as SomeObject[Property] extends Type | Record<string, unknown>
    ? Property
    : never]: SomeObject[Property] extends Record<string, unknown>
    ? PickByType<SomeObject[Property], Type>
    : SomeObject[Property];
};
