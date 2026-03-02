import type { Newable } from '../vitest-augmentation'
import { expect } from 'vitest'

const ok = { pass: true, message: () => 'OK' }
const error = (msg: string) => ({
  pass: false,
  message: () => msg,
})

/**
 * Checks if the value received is any of the types sent.
 *
 * @param received - The value to check.
 * @param classTypeUnion - Array of types.
 *
 * @returns Ok if the element is any of the types sent, error otherwise.
 */
function anyOf(received: any, classTypeUnion: Newable[]) {
  const isValid = classTypeUnion.some(classType => {
    try {
      expect(received).toEqual(expect.any(classType))
      return true
    } catch {
      return false
    }
  })
  if (isValid) {
    return ok
  } else {
    return error(
      `Expected "${String(received)}" to be "${classTypeUnion
        .map(classType => String(classType.name))
        .join(' | ')}"`,
    )
  }
}

/**
 * Checks if the value received is null or any of the types sent.
 *
 * @param received - The value to check.
 * @param classTypeUnion - Array of types.
 *
 * @returns Ok if the object is null or any of the types sent, error otherwise.
 */
function nullOrAnyOf(received: any, classTypeUnion: Newable[]) {
  if (received !== null) {
    return anyOf(received, classTypeUnion)
  }
  return ok
}

/**
 * Checks if the value received is null or the type sent.
 *
 * @param received - The value to check.
 * @param classType - Type.
 *
 * @returns Ok if the object is null or the type sent, error otherwise.
 */
function nullOr(received: any, classType: Newable) {
  if (received !== null) {
    try {
      expect(received).toEqual(expect.any(classType))
    } catch {
      return error(`Expected "${String(received)}" to be "${String(classType)}" or "null"`)
    }
  }
  return ok
}

/**
 * Checks if the value received is null or match the schema sent.
 *
 * @param received - The value to check.
 * @param schema - The schema.
 *
 * @returns Ok if the object is null or match the schema sent, error otherwise.
 */
function nullOrMatch(received: any, schema: Record<string, any>) {
  if (received !== null) {
    try {
      expect(received).toMatchObject(schema)
    } catch {
      return error(`Expected "${received}" to match "${JSON.stringify(schema)}" or "null"`)
    }
  }
  return ok
}

/**
 * Checks if the value received is undefined or match the schema sent.
 *
 * @param received - The value to check.
 * @param schema - The schema.
 *
 * @returns Ok if the object s undefined or match the schema sent, error otherwise.
 */
function undefinedOrMatch(received: any, schema: Record<string, any>) {
  if (received !== undefined) {
    try {
      expect(received).toMatchObject(schema)
    } catch {
      return error(`Expected "${received}" to match "${JSON.stringify(schema)}" or "undefined"`)
    }
  }
  return ok
}

/**
 * Checks if the value received is undefined or the type sent.
 *
 * @param received - The value to check.
 * @param classType - Type.
 *
 * @returns Ok if the object is undefined or the type sent, error otherwise.
 */
function undefinedOr(received: any, classType: Newable) {
  if (received !== undefined) {
    try {
      expect(received).toEqual(expect.any(classType))
    } catch {
      return error(`Expected "${String(received)}" to be "${String(classType)}" or "undefined"`)
    }
  }
  return ok
}

/**
 * Checks if the value received is null, undefined or the type sent.
 *
 * @param received - The value to check.
 * @param classType - Type.
 *
 * @returns Ok if the object is null, undefined or the type sent, error otherwise.
 */
function nullOrUndefinedOr(received: any, classType: Newable) {
  if (received != null) {
    try {
      expect(received).toEqual(expect.any(classType))
    } catch {
      return error(
        `Expected "${String(received)}" to be "${String(classType)}" or "null" or "undefined"`,
      )
    }
  }
  return ok
}

/**
 * Checks if the value received is an array of the type sent.
 *
 * @param received - Array of values to check.
 * @param classType - Type.
 *
 * @returns Ok if the object is an array of the type sent, error otherwise.
 */
function arrayOf(received: any[], classType: Newable) {
  try {
    received.every(object => expect(object).toEqual(expect.any(classType)))
  } catch {
    return error(`Expected "${String(received)}" to be an array of "${String(classType)}"`)
  }
  return ok
}

/**
 * Checks if the every value received matches to the schema sent.
 *
 * @param received - Array of values to check.
 * @param schema - Schema.
 *
 * @returns Ok if the every value received matches to the schema sent, error otherwise.
 */
function everyItemToMatch(received: any[], schema: Record<string, any>) {
  try {
    received.every(object => expect(object).toMatchObject(schema))
  } catch {
    return error(
      `Expected every item of "${String(received)}" to match "${JSON.stringify(schema)}"`,
    )
  }
  return ok
}

/**
 * Asserts that an string is a valid URL which has exactly, and only the parameters passed.
 * If the URL contains another parameter not present in the parameters parameter the assertion
 * will fail.
 *
 * @param urlString - String that represents the url.
 * @param parameters - The query parameters that the url must have.
 *
 * @returns Ok if the parameters of the url are exactly the same as the ones passed
 * by parameter, error otherwise.
 */
function toBeAValidURLWithExactQueryParameters(
  urlString: string,
  parameters: Record<string, string | string[]>,
) {
  try {
    const url = new URL(urlString)
    const actualParams = Object.fromEntries(url.searchParams.entries())

    const pass = JSON.stringify(actualParams) === JSON.stringify(parameters)

    return {
      pass,
      message: () => `Query parameters do not match exactly`,
    }
  } catch {
    return {
      pass: false,
      message: () => `Invalid URL`,
    }
  }
}

/**
 * Asserts that an string is a valid URL which contains the parameters passed.
 *
 * @param urlString - String that represents the url.
 * @param parameters - The query parameters that the url must contain.
 *
 * @returns Ok if the parameters of the url are contain in the ones passed
 * by parameter, error otherwise.
 */
function toBeAValidURLWithQueryParameters(
  urlString: any,
  parameters: Record<string, string | string[]>,
) {
  const url = new URL(urlString as string)
  for (const key of Object.keys(parameters)) {
    const expectedValue = parameters[key]
    if (!url.searchParams.has(key)) {
      return error(
        `Expected URL to include parameter "${key}" with value "${String(
          parameters[key],
        )}", but it is not present`,
      )
    }

    if (Array.isArray(expectedValue)) {
      const received = url.searchParams.getAll(key)
      try {
        expect(received).toEqual(expectedValue)
      } catch {
        return error(
          `Expected parameters with key "${key}" to equal array "${String(
            expectedValue,
          )}", but it has value "${String(received)}"`,
        )
      }
    } else if (url.searchParams.get(key) !== expectedValue) {
      return error(
        `Expected parameter "${key}" to equal value "${String(
          expectedValue,
        )}", but it has value "${String(url.searchParams.get(key))}"`,
      )
    }
  }
  return ok
}

expect.extend({
  nullOr,
  nullOrMatch,
  nullOrAnyOf,
  undefinedOr,
  undefinedOrMatch,
  nullOrUndefinedOr,
  arrayOf,
  anyOf,
  arrayOfItemsMatching: everyItemToMatch,
  toBeNullOr: nullOr,
  toBeUndefinedOr: undefinedOr,
  toBeNullOrUndefinedOr: nullOrUndefinedOr,
  everyItemToBe: arrayOf,
  everyItemToMatch,
  toBeAValidURLWithExactQueryParameters,
  toBeAValidURLWithQueryParameters,
})
