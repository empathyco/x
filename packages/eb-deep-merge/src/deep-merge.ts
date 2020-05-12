/**
 * Clones deeply all of the sources objects values into the target, except the arrays,
 * which only generates a new one, but keeping the references of the sources one.
 *
 * TODO Make it work with circular references.
 * @param target The object which will be used as the base to clone all the sources into.
 * @param sources One or more objects to clone to the target.
 * @returns {any} The target modified.
 */
export function deepMerge(target: any, ...sources: any[]): any {
  return sources.reduce(cloneSourcesProperties, target || {});
}

const behaviourMap = new WeakMap();

/**
 * When setting replace behaviour to an object, target properties will not be used, only the source ones.
 *
 * @param obj - The object to set its merge behavior.
 * @example
 * ```ts
 * const target = { children: { a: 1, b: 2, c: 3 } };
 * const firstSource = { children: replaceBehaviour({ c: 4, d: 5 }) };
 * deepMerge(target, firstSource);
 * // `target` is now { children: { c: 4, d: 5 } }
 * ```
 */
export function replaceBehaviour<T extends object>(obj: T): T {
  behaviourMap.set(obj, Behaviour.Replace);
  return obj;
}

/**
 * When setting deep merge behaviour, target and source properties will be used. This is the default
 * behavior.
 *
 * @param obj - The object to set its merge behavior.
 */
export function deepMergeBehaviour<T extends object>(obj: T): T {
  behaviourMap.set(obj, Behaviour.DeepMerge);
  return obj;
}

enum Behaviour { Replace = 'replace', DeepMerge = 'deep-merge' }

function cloneSourcesProperties(target: any, source: any): (source: any) => void {
  if (source) {
    return Object.entries(source).reduce(cloneObjectProperties, target);
  } else {
    return target || {};
  }
}

function cloneObjectProperties(target: any, [key, value]: any): any {
  if (value === undefined) {
    delete target[key];
  } else if (isObject(value)) {
    mergeObject(target, [key, value]);
  } else if (Array.isArray(value)) {
    target[key] = [...value];
  } else {
    target[key] = value;
  }
  return target;
}

function isObject(obj: any): obj is object {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

function mergeObject(target: any, [key, value]: any): any {
  const mergeBehaviour = getMergeBehaviour(target[key], value);
  if (mergeBehaviour === Behaviour.Replace) {
    target[key] = deepMerge({}, value);
    replaceBehaviour(target[key]);
  } else if (mergeBehaviour === Behaviour.DeepMerge) {
    target[key] = deepMerge(target[key] || {}, value);
    deepMergeBehaviour(target[key]);
  } else {
    target[key] = deepMerge(target[key], value);
  }
}

function getMergeBehaviour(targetValue: any, sourceValue: any): Behaviour {
  return behaviourMap.get(sourceValue) || behaviourMap.get(targetValue);
}

