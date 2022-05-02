import {
  EmpathyExtendedExpect,
  EmpathyExtendedMatchers,
  FunctionType,
  Newable
} from './jest-utils.types';

declare global {
  namespace jest {
    export interface Expect extends EmpathyExtendedExpect {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    undefinedOrMatch,
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

const ok: jest.CustomMatcherResult = { pass: true, message: () => 'OK' };
const error = (msg: string): jest.CustomMatcherResult => ({
  pass: false,
  message: () => msg
});

/**
 * Checks if the value received is null or any of the types sent.
 *
 * @param received - The value to check.
 * @param classTypeUnion - Array of types.
 * @returns Ok if the object is null or any of the types sent, error otherwise.
 */
function nullOrAnyOf(received: any, classTypeUnion: Newable[]): jest.CustomMatcherResult {
  if (received !== null) {
    try {
      anyOf(received, classTypeUnion);
    } catch {
      return error(
        `Expected "${received}" to be "${classTypeUnion
          .map(classType => classType.name)
          .join(' | ')}" or null`
      );
    }
  }
  return ok;
}

/**
 * Checks if the value received is any of the types sent.
 *
 * @param received - The value to check.
 * @param classTypeUnion - Array of types.
 * @returns Ok if the element is any of the types sent, error otherwise.
 */
function anyOf(received: any, classTypeUnion: Newable[]): jest.CustomMatcherResult {
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
    return error(
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
 * @returns Ok if the object is null or the type sent, error otherwise.
 */
function nullOr(received: any, classType: Newable): jest.CustomMatcherResult {
  if (received !== null) {
    try {
      expect(received).toEqual(expect.any(classType));
    } catch {
      return error(`Expected "${received}" to be "${classType}" or "null"`);
    }
  }
  return ok;
}

/**
 * Checks if the value received is null or match the schema sent.
 *
 * @param received - The value to check.
 * @param schema - The schema.
 * @returns Ok if the object is null or match the schema sent, error otherwise.
 */
function nullOrMatch(received: any, schema: Record<string, any>): jest.CustomMatcherResult {
  if (received !== null) {
    try {
      expect(received).toMatchObject(schema);
    } catch {
      return error(`Expected "${received}" to match "${schema}" or "null"`);
    }
  }
  return ok;
}

/**
 * Checks if the value received is undefined or match the schema sent.
 *
 * @param received - The value to check.
 * @param schema - The schema.
 * @returns Ok if the object s undefined or match the schema sent, error otherwise.
 */
function undefinedOrMatch(received: any, schema: Record<string, any>): jest.CustomMatcherResult {
  if (received !== undefined) {
    try {
      expect(received).toMatchObject(schema);
    } catch {
      return error(`Expected "${received}" to match "${schema}" or "null"`);
    }
  }
  return ok;
}

/**
 * Checks if the value received is undefined or the type sent.
 *
 * @param received - The value to check.
 * @param classType - Type.
 * @returns Ok if the object is undefined or the type sent, error otherwise.
 */
function undefinedOr(received: any, classType: Newable): jest.CustomMatcherResult {
  if (received !== undefined) {
    try {
      expect(received).toEqual(expect.any(classType));
    } catch {
      return error(`Expected "${received}" to be "${classType}" or "undefined"`);
    }
  }
  return ok;
}

/**
 * Checks if the value received is null, undefined or the type sent.
 *
 * @param received - The value to check.
 * @param classType - Type.
 * @returns Ok if the object is null, undefined or the type sent, error otherwise.
 */
function nullOrUndefinedOr(received: any, classType: Newable): jest.CustomMatcherResult {
  if (received != null) {
    try {
      expect(received).toEqual(expect.any(classType));
    } catch {
      return error(`Expected "${received}" to be "${classType}" or "null" or "undefined"`);
    }
  }
  return ok;
}

/**
 * Checks if the value received is an array of the type sent.
 *
 * @param received - Array of values to check.
 * @param classType - Type.
 * @returns Ok if the object is an array of the type sent, error otherwise.
 */
function arrayOf(received: any[], classType: Newable): jest.CustomMatcherResult {
  try {
    received.every(object => expect(object).toEqual(expect.any(classType)));
  } catch {
    return error(`Expected "${received}" to be an array of "${classType}"`);
  }
  return ok;
}

/**
 * Checks if the every value received matches to the schema sent.
 *
 * @param received - Array of values to check.
 * @param schema - Schema.
 * @returns Ok if the every value received matches to the schema sent, error otherwise.
 */
function everyItemToMatch(received: any[], schema: Record<string, any>): jest.CustomMatcherResult {
  try {
    received.every(object => expect(object).toMatchObject(schema));
  } catch {
    return error(`Expected every item of "${received}" to match "${schema}"`);
  }
  return ok;
}

/**
 * Asserts that an string is a valid URL which has exactly, and only the parameters passed.
 * If the URL contains another parameter not present in the parameters parameter the assertion
 * will fail.
 *
 * @param urlString - String that represents the url.
 * @param parameters - The query parameters that the url must have.
 * @returns Ok if the parameters of the url are exactly the same as the ones passed
 * by parameter, error otherwise.
 */
function toBeAValidURLWithExactQueryParameters(
  urlString: any,
  parameters: Record<string, string | string[]>
): any {
  const entries = Object.fromEntries(new URL(urlString).searchParams);
  try {
    expect(entries).toEqual(parameters);
  } catch {
    return error(
      `Expected URL parameters "${JSON.stringify(parameters)}" to be "${JSON.stringify(entries)}",
         but it is not present"`
    );
  }
  return ok;
}

/**
 * Asserts that an string is a valid URL which contains the parameters passed.
 *
 * @param urlString - String that represents the url.
 * @param parameters - The query parameters that the url must contain.
 * @returns Ok if the parameters of the url are contain in the ones passed
 * by parameter, error otherwise.
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
