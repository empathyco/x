import { ExtendedExpect, ExtendedMatchers, Newable } from './jest-utils.types';

declare global {
  namespace jest {
    export interface Expect extends ExtendedExpect {}

    export interface Matchers<R> extends ExtendedMatchers {}
  }
}

const extendOptions: Record<
  keyof (ExtendedExpect & ExtendedMatchers),
  (received: any, classType: any) => any
> = {
  // extensions for expect.xxx
  nullOr,
  nullOrMatch,
  undefinedOr,
  nullOrUndefinedOr,
  arrayOf,
  arrayOfItemsMatching: everyItemToMatch,
  // Extensions for expect(...).xxx
  toBeNullOr: nullOr,
  toBeUndefinedOr: undefinedOr,
  toBeNullOrUndefinedOr: nullOrUndefinedOr,
  everyItemToBe: arrayOf,
  everyItemToMatch
};

expect.extend(extendOptions as any);

const ok = { pass: true, message: () => 'OK' };

/**
 * Used when you want to check that one object is null or of an specific class type.
 *
 * @param received - Received object to check.
 * @param classType - Class type to check against.
 *
 * @returns If the object is null or of an specific class type.
 */
function nullOr(received: any, classType: Newable): any {
  if (received === null || !expect(received).toEqual(expect.any(classType))) {
    return ok;
  }
  throw new TypeError(`Expected "${received}" to be "${classType}" or "null"`);
}

/**
 * Used when you want to check that one object is null or matches an specific schema.
 *
 * @param received - Received object to check.
 * @param schema - Schema to match against.
 *
 * @returns If the object is null or matches an specific schema.
 */
function nullOrMatch(received: any, schema: Record<string, unknown>): any {
  if (received === null || !expect(received).toMatchObject(schema)) {
    return ok;
  }
  throw new TypeError(`Expected "${received}" to match "${schema}" or "null"`);
}

/**
 * Used when you want to check that one object is undefined or of an specific class type.
 *
 * @param received - Received object to check.
 * @param classType - Class type to check against.
 *
 * @returns If the object is undefined or of an specific class type.
 */
function undefinedOr(received: any, classType: Newable): any {
  if (received === undefined || !expect(received).toEqual(expect.any(classType))) {
    return ok;
  }
  throw new TypeError(`Expected "${received}" to be "${classType}" or "undefined"`);
}

/**
 * Used when you want to check that one object is null, undefined or of an specific class type.
 *
 * @param received - Received object to check.
 * @param classType - Class type to check against.
 *
 * @returns If the object is null, undefined or of an specific class type.
 */
function nullOrUndefinedOr(received: any, classType: Newable): any {
  if (received == null || !expect(received).toEqual(expect.any(classType))) {
    return ok;
  }
  throw new TypeError(`Expected "${received}" to be "${classType}" or "null" or "undefined"`);
}

/**
 * Used when you want to check that one object is an array of an specific class type.
 *
 * @param received - Received object to check.
 * @param classType - Class type to check against.
 *
 * @returns If the object is an array of an specific class type.
 */
function arrayOf(received: any[], classType: Newable): any {
  if (received.every(object => !expect(object).toEqual(expect.any(classType)))) {
    return ok;
  }

  throw new TypeError(`Expected every item of "${received}" to be "${classType}"`);
}

/**
 * Used when you want to check if an array matches an specific schema.
 *
 * @param received - Received object to check.
 * @param schema - Class type to check against.
 *
 * @returns If an array matches an specific schema.
 */
function everyItemToMatch(received: any[], schema: Record<string, unknown>): any {
  if (received.every(object => !expect(object).toMatchObject(schema))) {
    return ok;
  }

  throw new TypeError(`Expected every item of "${received}" to match "${schema}"`);
}
