import type { UrlParamValue, UrlXStoreModule } from '../types'
import { objectFilter } from '@empathyco/x-utils'
import { initialUrlState } from '../initial-state'

/**
 * Default implementation for the getter.
 *
 * @param state - Current state of the url module.
 * @param state.initialExtraParams - initialExtraParams state.
 *
 * @returns The url params.
 * @public
 */
export const urlParams: UrlXStoreModule['getters']['urlParams'] = ({
  initialExtraParams,
  ...params
}) =>
  objectFilter(params, (paramKey, paramValue) => {
    return paramKey in initialUrlState
      ? isNotDefaultValue(paramKey, paramValue, initialUrlState)
      : isNotEmptyParam(paramValue) && isNotDefaultValue(paramKey, paramValue, initialExtraParams)
  })

/**
 * Checks if a parameter is not empty to avoid adding it to the URL.
 *
 * @param value - The value of the key parameter.
 *
 * @returns True if is not empty, False otherwise.
 */
function isNotEmptyParam(value: UrlParamValue | unknown): boolean {
  return Array.isArray(value) ? value.length > 0 : value != null && value !== ''
}

/**
 * Checks if a parameter is not the default state value to avoid adding it to the URL.
 *
 * @param key - The key parameter.
 * @param value - The value of the key parameter.
 * @param defaultValues - The default values to compare.
 *
 * @returns True if is not the default state value, False otherwise.
 */
function isNotDefaultValue<Key extends string | number, Value extends UrlParamValue | unknown>(
  key: Key,
  value: Value,
  defaultValues: Record<Key, Value>,
): boolean {
  return Array.isArray(value) ? value.length > 0 : defaultValues[key] !== value
}
