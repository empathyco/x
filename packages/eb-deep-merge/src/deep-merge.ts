/**
 * Clones deeply all of the sources objects values into the target, except the arrays,
 * which only generates a new one, but keeping the references of the sources one.
 * TODO Make it work with circular references.
 * @param target The object which will be used as the base to clone all the sources into.
 * @param sources One or more objects to clone to the target.
 * @returns {any} The target modified.
 */
export function deepMerge(target: any, ...sources: any[]): any {
  return sources.reduce(cloneSourcesProperties, target || {});
}

export function replaceBehaviour<T>(obj: T): T {
  Reflect.defineMetadata(behaviourMetadataKey, Behaviour.Replace, obj);
  return obj;
}

export function deepMergeBehaviour<T>(obj: T): T {
  Reflect.defineMetadata(behaviourMetadataKey, Behaviour.DeepMerge, obj);
  return obj;
}

const behaviourMetadataKey = 'deep-merge-behaviour';

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

function isObject(obj: any): boolean {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

function mergeObject(target: any, [key, value]: any): any {
  if (getMergeBehaviour(target[key], value) === Behaviour.Replace) {
    target[key] = replaceBehaviour(value);
  } else {
    target[key] = deepMerge(deepMergeBehaviour(target[key] || {}), value);
  }
}

function getMergeBehaviour(targetValue: any, sourceValue: any): Behaviour {
  return Reflect.getMetadata(behaviourMetadataKey, sourceValue || {}) || Reflect.getMetadata(behaviourMetadataKey, targetValue || {});
}

