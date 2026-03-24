import 'vitest'

export type Newable<T = any> = new (...args: any[]) => T

declare module 'vitest' {
  interface Assertion<T = any> {
    toBeNullOr: (classType: Newable) => T
    toBeUndefinedOr: (classType: Newable) => T
    toBeNullOrUndefinedOr: (classType: Newable) => T
    everyItemToBe: (classType: Newable) => T
    everyItemToMatch: (schema: Record<string, any>) => T
    toBeAValidURLWithExactQueryParameters: (parameters: Record<string, string | string[]>) => T
    toBeAValidURLWithQueryParameters: (parameters: Record<string, string | string[]>) => T
  }
  interface AsymmetricMatchersContaining {
    nullOr: (classType: Newable) => any
    nullOrMatch: (schema: Record<string, any>) => any
    nullOrAnyOf: (classTypeUnion: Newable[]) => any
    undefinedOr: (classType: Newable) => any
    undefinedOrMatch: (schema: Record<string, any>) => any
    nullOrUndefinedOr: (classType: Newable) => any
    arrayOf: (classType: Newable) => any
    anyOf: (classTypeUnion: Newable[]) => any
    arrayOfItemsMatching: (schema: Record<string, any>) => any
  }
}
