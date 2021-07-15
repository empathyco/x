export interface EmpathyExtendedExpect {
  arrayOf(classType: Newable): any;
  arrayOfItemsMatching(schema: {}): any;
  nullOr(classType: Newable): any;
  nullOrAnyOf(classType: Newable[]): any;
  nullOrMatch(schema: {}): any;
  nullOrUndefinedOr(classType: Newable): any;
  undefinedOr(classType: Newable): any;
  anyOf(classTypeUnion: Newable[]): any;
}

export interface EmpathyExtendedMatchers {
  everyItemToBe(classType: Newable): any;
  everyItemToMatch(schema: {}): any;
  toBeNullOr(classType: Newable): any;
  toBeNullOrUndefinedOr(classType: Newable): any;
  toBeUndefinedOr(classType: Newable): any;
  toBeAValidURLWithExactQueryParameters(parameters: Record<string, string | string[]>): any;
  toBeAValidURLWithQueryParameters(parameters: Record<string, string | string[]>): any;
}

export type Newable<T = any> = new(...args: any[]) => T;
