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
  // Extensions for expect(...).xxx
  toBeNullOr: nullOr,
  toBeUndefinedOr: undefinedOr,
  toBeNullOrUndefinedOr: nullOrUndefinedOr,
  everyItemToBe: arrayOf,
  everyItemToMatch
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
