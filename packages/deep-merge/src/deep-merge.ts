enum Behaviour {
  Replace = 'replace',
  DeepMerge = 'deep-merge',
}

/**
 * Clones deeply all of the sources objects values into the target, except the arrays,
 * which only generates a new one, but keeping the references of the sources one.
 *
 * TODO Make it work with circular references.
 *
 * @param target - The object which will be used as the base to clone all the sources into.
 * @param sources - One or more objects to clone to the target.
 *
 * @returns The target modified.
 */
export function deepMerge(target: any, ...sources: any[]): any {
  return sources.reduce(cloneSourcesProperties, target || {});
}

const behaviourMap = new WeakMap();

/**
 * When setting replace behaviour to an object, target properties will not be used,
 * only the source ones.
 *
 * @param obj - The object to set its merge behavior.
 * @example
 * ```ts
 * const target = { children: { a: 1, b: 2, c: 3 } };
 * const firstSource = { children: replaceBehaviour({ c: 4, d: 5 }) };
 * deepMerge(target, firstSource);
 * // `target` is now { children: { c: 4, d: 5 } }
 * ```
 *
 * @returns The same object with the new behaviour.
 */
export function replaceBehaviour<T extends Record<string, unknown>>(obj: T): T {
  behaviourMap.set(obj, Behaviour.Replace);
  return obj;
}

/**
 * When setting deep merge behaviour, target and source properties will be used. This is the default
 * behavior.
 *
 * @param obj - The object to set its merge behavior.
 *
 * @returns The same object with the new behaviour.
 */
export function deepMergeBehaviour<T extends Record<string, unknown>>(obj: T): T {
  behaviourMap.set(obj, Behaviour.DeepMerge);
  return obj;
}

/**
 * A function which clones the properties of two sources.
 *
 * @param target - The target object to clone in.
 * @param source - The source objet to clone.
 *
 * @returns The union of the target and source.
 */
function cloneSourcesProperties(target: any, source: any): (source: any) => void {
  if (source) {
    return Object.entries(source).reduce(cloneObjectProperties, target);
  } else {
    return target || {};
  }
}

/**
 * A function which clones the properties of two object.
 *
 * @param target - The target object to clone in.
 * @param source - Key-Value to clone into the target object.
 *
 * @returns The target object updated with the entry parameter.
 */
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

/**
 * Returns true if the revieved parameter is an object.
 *
 * @param obj - The object to check.
 *
 * @returns A boolean indicating if the parameter is an object.
 */
function isObject(obj: any): obj is Record<string, unknown> {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

/**
 * A function which merges two sources.
 *
 * @param target - The target object to clone in.
 * @param source - Key-Value to clone into the target object.
 *
 */
function mergeObject(target: any, [key, value]: any): void {
  const mergeBehaviour = getMergeBehaviour(target[key], value);
  if (mergeBehaviour === Behaviour.Replace) {
    target[key] = deepMerge({}, value);
    replaceBehaviour(target[key]);
  } else if (mergeBehaviour === Behaviour.DeepMerge) {
    target[key] = deepMerge(target[key] || {}, value);
    deepMergeBehaviour(target[key]);
  } else {
    target[key] = deepMerge(isObject(target[key]) ? target[key] : {}, value);
  }
}

/**
 * A function which detects the merge behaviour.
 *
 * @param targetValue - The target object.
 * @param sourceValue - The source objet.
 *
 * @returns The correct behaviour.
 */
function getMergeBehaviour(targetValue: any, sourceValue: any): Behaviour {
  return behaviourMap.get(sourceValue) || behaviourMap.get(targetValue);
}
