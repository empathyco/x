import { ExtendedExpect, ExtendedMatchers, Newable } from './jest-utils.types';

declare global {
  namespace jest {
    export interface Expect extends ExtendedExpect {}

    export interface Matchers<R> extends ExtendedMatchers {}
  }
}

const extendOptions: Record<keyof (ExtendedExpect & ExtendedMatchers), Function> = {
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
  everyItemToMatch,
  toBeAValidURLWithExactQueryParameters,
  toBeAValidURLWithQueryParameters
};

expect.extend(extendOptions as any);

const ok = { pass: true, message: () => 'OK' };

function nullOr(received: any, classType: Newable): any {
  if (received === null || !expect(received).toEqual(expect.any(classType))) {
    return ok;
  }
  throw new TypeError(`Expected "${ received }" to be "${ classType }" or "null"`);
}

function nullOrMatch(received: any, schema: {}): any {
  if (received === null || !expect(received).toMatchObject(schema)) {
    return ok;
  }
  throw new TypeError(`Expected "${ received }" to match "${ schema }" or "null"`);
}

function undefinedOr(received: any, classType: Newable): any {
  if (received === undefined || !expect(received).toEqual(expect.any(classType))) {
    return ok;
  }
  throw new TypeError(`Expected "${ received }" to be "${ classType }" or "undefined"`);
}

function nullOrUndefinedOr(received: any, classType: Newable): any {
  if (received == null || !expect(received).toEqual(expect.any(classType))) {
    return ok;
  }
  throw new TypeError(`Expected "${ received }" to be "${ classType }" or "null" or "undefined"`);
}

function arrayOf(received: any[], classType: Newable): any {
  if (received.every(object => !expect(object).toEqual(expect.any(classType)))) {
    return ok;
  }

  throw new TypeError(`Expected every item of "${ received }" to be "${ classType }"`);
}

function everyItemToMatch(received: any[], schema: {}): any {
  if (received.every(object => !expect(object).toMatchObject(schema))) {
    return ok;
  }

  throw new TypeError(`Expected every item of "${ received }" to match "${ schema }"`);
}

/**
 * Asserts that an string is a valid URL which has exactly, and only the parameters passed.
 * If the URL contains another parameter not present in the parameters parameter the assertion will fail
 * @param parameters The query parameters that the url must have.
 */
function toBeAValidURLWithExactQueryParameters(urlString: any, parameters: Record<string, string | string[]>): any {
  const url = new URL(urlString);
  url.searchParams.forEach((value, key) => {
    const expectedValue = parameters[key];
    if (!(key in parameters)) {
      throw new TypeError(`Expected parameter "${ key }" to equal value "${ expectedValue }", but it is not present`);
    }
    if (Array.isArray(expectedValue)) {
      const received = url.searchParams.getAll(key);
      try {
        expect(received).toEqual(expectedValue);
      } catch {
        throw new TypeError(
          `Expected parameters with key "${ key }" to equal array "${ expectedValue }", but it has value "${ received }"`);
      }
    } else if (value !== expectedValue) {
      throw new TypeError(`Expected parameter "${ key }" to equal value "${ expectedValue }", but it has value "${ value }"`);
    }
  });
  return ok;
}

/**
 * Asserts that an string is a valid URL which contains the parameters passed.
 * @param parameters The query parameters that the url must contain.
 */
function toBeAValidURLWithQueryParameters(urlString: any, parameters: Record<string, string | string[]>): any {
  const url = new URL(urlString);
  Object.keys(parameters).forEach((key) => {
    const expectedValue = parameters[key];
    if (!url.searchParams.has(key)) {
      throw new TypeError(
        `Expected URL to include parameter "${ key }" with value "${ parameters[key] }", but it is not present"`);
    }

    if (Array.isArray(expectedValue)) {
      const received = url.searchParams.getAll(key);
      try {
        expect(received).toEqual(expectedValue);
      } catch {
        throw new TypeError(
          `Expected parameters with key "${ key }" to equal array "${ expectedValue }", but it has value "${ received }"`);
      }
    } else if (url.searchParams.get(key) !== expectedValue) {
      throw new TypeError(
        `Expected parameter "${ key }" to equal value "${ expectedValue }", but it has value "${ url.searchParams.get(key) }"`);
    }
  });
  return ok;
}
