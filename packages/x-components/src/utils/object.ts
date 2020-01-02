import { Dictionary } from './types';

/**
 * Iterates over every non-undefined property of the object calling the callback passed as parameter.
 * @param obj The object to iterate through each property
 * @param callbackFn The callback function to call for each property
 */
export function forEach<T extends Dictionary>(
  obj: T | undefined | null,
  callbackFn: (key: keyof T, value: Exclude<T[keyof T], undefined>, index: number) => void
): void {
  if (obj == null) {
    return;
  }
  let index = 0;
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      callbackFn(key, obj[key], index++);
    }
  }
}
