export function getSafePropertyChain<T = any>(obj: any, propertyChain: string): T | undefined;
export function getSafePropertyChain<T = any>(
  obj: any,
  propertyChain: string,
  defaultReturn?: T
): T;
export function getSafePropertyChain<T = any>(
  obj: any,
  propertyChain: string,
  defaultReturn?: T
): T {
  const resolved = getChain(obj, ...propertyChain.split('.'));
  return resolved === undefined ? defaultReturn : resolved;
}

function getChain<T = any>(obj: any, property = '', ...propertyChain: string[]): T | undefined {
  // eslint-disable-next-line eqeqeq
  return obj == undefined && property
    ? undefined
    : !property
    ? obj
    : getChain(obj[property], ...propertyChain);
}
