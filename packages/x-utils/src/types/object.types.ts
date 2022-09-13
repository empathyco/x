/**
 * Makes required the specified properties of the given type.
 *
 * @example
 * ```ts
 * type Required = RequiredProperties<{ a?: string; b?: number; }, 'a'>;
 * // { a: string; b?: number; }
 * ```
 * @public
 */
export type RequiredProperties<Something, Keys extends keyof Something> = Something &
  Required<Pick<Something, Keys>>;
