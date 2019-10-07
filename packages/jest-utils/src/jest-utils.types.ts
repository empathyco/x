export interface ExtendedExpect {
  arrayOf(classType: Newable): any;
  arrayOfItemsMatching(schema: Record<string, unknown>): any;
  nullOr(classType: Newable): any;
  nullOrMatch(schema: Record<string, unknown>): any;
  nullOrUndefinedOr(classType: Newable): any;
  undefinedOr(classType: Newable): any;
}

export interface ExtendedMatchers {
  everyItemToBe(classType: Newable): any;
  everyItemToMatch(schema: Record<string, unknown>): any;
  toBeNullOr(classType: Newable): any;
  toBeNullOrUndefinedOr(classType: Newable): any;
  toBeUndefinedOr(classType: Newable): any;
}

export type Newable<T = any> = new (...args: any[]) => T;
