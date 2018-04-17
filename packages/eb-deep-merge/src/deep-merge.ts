/**
 * Clones deeply all of the sources objects values into the target, except the arrays,
 * which only generates a new one, but keeping the references of the sources one.
 * TODO Make it work with circular references.
 * @param target The object which will be used as the base to clone all the sources into.
 * @param sources One or more objects to clone to the target.
 * @returns {any} The target modified.
 */
export function deepMerge(target: any, ...sources: any[]): any {
  return sources.reduce(cloneSourcesProperties, target);
}

function cloneSourcesProperties(target: any, source: any): (source: any) => void {
  if (source) {
    return Object.entries(source).reduce(cloneObjectProperties, target);
  } else {
    return target;
  }
}

function cloneObjectProperties(target: any, [key, value]: any): any {
  if (isObject(value)) {
    target[key] = deepMerge(target[key] || {}, value);
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

