export function getSafePropertyChain<T = any>(obj: any, propertyChain: string, defaultReturn?: T): T | undefined {
  const resolved = getChain(obj, ...propertyChain.split('.'));
  return resolved === undefined
    ? defaultReturn
    : resolved;
}

function getChain<T = any>(obj: any, ...[property, ...propertyChain]: string[]): T | undefined {
  return obj === undefined || !property
    ? obj
    : getChain(obj[property], ...propertyChain);
}
