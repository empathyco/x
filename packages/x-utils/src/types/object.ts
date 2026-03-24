/**
 * Makes required the specified properties of the given type.
 *
 * @remarks example
 * ```ts
 * type Required = RequiredProperties<{ a?: string; b?: number; }, 'a'>;
 * // { a: string; b?: number; }
 * ```
 */
export type RequiredProperties<Something, Keys extends keyof Something> = Something &
  Required<Pick<Something, Keys>>
