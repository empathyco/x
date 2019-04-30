export function getSafePropertyChain<T = any>(obj: any, propertyChain: string, defaultReturn?: T): T | undefined {
  if (obj === undefined) {
    return defaultReturn;
  }
  const properties: string[] = propertyChain ? propertyChain.split('.') : [];
  if (!properties.length) {
    return obj;
  }
  if (properties.length === 1) {
    const value = obj[properties[0]];
    return value === undefined ? defaultReturn : value;
  }
  return getSafePropertyChain(obj[properties[0]], properties.slice(1).join('.'), defaultReturn);
}
