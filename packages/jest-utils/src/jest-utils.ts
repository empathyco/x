import {
  EmpathyExtendedExpect,
  EmpathyExtendedMatchers,
  FunctionType,
  Newable
} from './jest-utils.types';

declare global {
  namespace jest {
    export interface Expect extends EmpathyExtendedExpect {}

    export interface Matchers<R> extends EmpathyExtendedMatchers {}
  }
}

const extendOptions: Record<keyof (EmpathyExtendedExpect & EmpathyExtendedMatchers), FunctionType> =
  {
    // extensions for expect.xxx
    nullOr,
    nullOrMatch,
    nullOrAnyOf,
    undefinedOr,
    nullOrUndefinedOr,
    arrayOf,
    anyOf,
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
/**
 * Checks if the value received is null or any of the types sent.
 *
 * @param received - The value to check.
 * @param classTypeUnion - Array of types.
 *
 * @returns A .
 */
function nullOrAnyOf(received: any, classTypeUnion: Newable[]): any {
  try {
    if (received === null || anyOf(received, classTypeUnion)) {
      return ok;
    }
  } catch {
    throw new TypeError(
      `Expected "${received}" to be "${classTypeUnion
        .map(classType => classType.name)
        .join(' | ')}" or null`
    );
  }
}

/**
 * Checks if the value received is any of the types sent.
 *
 * @param received - The value to check.
 * @param classTypeUnion - Array of types.
 *
 * @returns A .
 */
function anyOf(received: any, classTypeUnion: Newable[]): any {
  const isValid = classTypeUnion.some(classType => {
    try {
      expect(received).toEqual(expect.any(classType));
      return true;
    } catch {
      return false;
    }
  });
  if (isValid) {
    return ok;
  } else {
    throw new TypeError(
      `Expected "${received}" to be "${classTypeUnion
        .map(classType => classType.name)
        .join(' | ')}"`
    );
  }
}

/**
 * Checks if the value received is null or the type sent.
 *
 * @param received - The value to check.
 * @param classType - Type.
 *
 * @returns A .
 */
function nullOr(received: any, classType: Newable): any {
  if (received === null || !expect(received).toEqual(expect.any(classType))) {
    return ok;
  }
  throw new TypeError(`Expected "${received}" to be "${classType}" or "null"`);
}

/**
 * Checks if the value received is null or match the schema sent.
 *
 * @param received - The value to check.
 * @param schema - The schema.
 *
 * @returns A .
 */
function nullOrMatch(received: any, schema: Record<string, any>): any {
  if (received === null || !expect(received).toMatchObject(schema)) {
    return ok;
  }
  throw new TypeError(`Expected "${received}" to match "${schema}" or "null"`);
}

/**
 * Checks if the value received is undefined or the type sent.
 *
 * @param received - The value to check.
 * @param classType - Type.
 *
 * @returns A .
 */
function undefinedOr(received: any, classType: Newable): any {
  if (received === undefined || !expect(received).toEqual(expect.any(classType))) {
    return ok;
  }
  throw new TypeError(`Expected "${received}" to be "${classType}" or "undefined"`);
}

/**
 * Checks if the value received is null, undefined or the type sent.
 *
 * @param received - The value to check.
 * @param classType - Type.
 *
 * @returns A .
 */
function nullOrUndefinedOr(received: any, classType: Newable): any {
  if (received == null || !expect(received).toEqual(expect.any(classType))) {
    return ok;
  }
  throw new TypeError(`Expected "${received}" to be "${classType}" or "null" or "undefined"`);
}

/**
 * Checks if the value received is an array of the type sent.
 *
 * @param received - Array of values to check.
 * @param classType - Type.
 *
 * @returns A .
 */
function arrayOf(received: any[], classType: Newable): any {
  if (received.every(object => !expect(object).toEqual(expect.any(classType)))) {
    return ok;
  }

  throw new TypeError(`Expected every item of "${received}" to be "${classType}"`);
}

/**
 * Checks if the every value received matches to the schema sent.
 *
 * @param received - Array of values to check.
 * @param schema - Schema.
 *
 * @returns A .
 */
function everyItemToMatch(received: any[], schema: Record<string, any>): any {
  if (received.every(object => !expect(object).toMatchObject(schema))) {
    return ok;
  }

  throw new TypeError(`Expected every item of "${received}" to match "${schema}"`);
}

/**
 * Asserts that an string is a valid URL which has exactly, and only the parameters passed.
 * If the URL contains another parameter not present in the parameters parameter the assertion
 * will fail.
 *
 * @param urlString - String that represents the url.
 * @param parameters - The query parameters that the url must have.
 *
 * @returns A.
 */
function toBeAValidURLWithExactQueryParameters(
  urlString: any,
  parameters: Record<string, string | string[]>
): any {
  const url = new URL(urlString);
  url.searchParams.forEach((value, key) => {
    const expectedValue = parameters[key];
    if (!(key in parameters)) {
      throw new TypeError(
        `Expected parameter "${key}" to equal value "${expectedValue}", but it is not present`
      );
    }
    if (Array.isArray(expectedValue)) {
      const received = url.searchParams.getAll(key);
      try {
        expect(received).toEqual(expectedValue);
      } catch {
        throw new TypeError(
          `Expected parameters with key "${key}" to equal array "${expectedValue}", 
          but it has value "${received}"`
        );
      }
    } else if (value !== expectedValue) {
      throw new TypeError(
        `Expected parameter "${key}" to equal value "${expectedValue}", but it has value "${value}"`
      );
    }
  });
  return ok;
}

/**
 * Asserts that an string is a valid URL which contains the parameters passed.
 *
 * @param urlString - String that represents the url.
 * @param parameters - The query parameters that the url must contain.
 *
 * @returns A.
 */
function toBeAValidURLWithQueryParameters(
  urlString: any,
  parameters: Record<string, string | string[]>
): any {
  const url = new URL(urlString);
  Object.keys(parameters).forEach(key => {
    const expectedValue = parameters[key];
    if (!url.searchParams.has(key)) {
      throw new TypeError(
        `Expected URL to include parameter "${key}" with value "${parameters[key]}",
         but it is not present"`
      );
    }

    if (Array.isArray(expectedValue)) {
      const received = url.searchParams.getAll(key);
      try {
        expect(received).toEqual(expectedValue);
      } catch {
        throw new TypeError(
          // eslint-disable-next-line max-len
          `Expected parameters with key "${key}" to equal array "${expectedValue}",but it has value "${received}"`
        );
      }
    } else if (url.searchParams.get(key) !== expectedValue) {
      throw new TypeError(
        // eslint-disable-next-line max-len
        `Expected parameter "${key}" to equal value "${expectedValue}",but it has value "${url.searchParams.get(
          key
        )}"`
      );
    }
  });
  return ok;
}
