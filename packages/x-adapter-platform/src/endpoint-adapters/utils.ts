import type { ExtraParamsRequest } from '@empathyco/x-types'

/**
 * Gets the Search service URL for the given request.
 *
 * @param from - The request.
 *
 * @returns The service URL.
 *
 * @internal
 */
export function getSearchServiceUrl(from: ExtraParamsRequest): string {
  return from.extraParams?.env === 'test'
    ? 'https://search.internal.test.empathy.co'
    : 'https://api.{extraParams.env(.)}empathy.co/search/v1'
}

/**
 * Gets the Beacon service URL for the given request.
 *
 * @param from - The request.
 *
 * @returns The service URL.
 *
 * @internal
 */
export function getBeaconServiceUrl(from: ExtraParamsRequest): string {
  return from.extraParams?.env === 'test'
    ? 'https://beacon-api.internal.test.empathy.co'
    : 'https://api.{extraParams.env(.)}empathy.co'
}

/**
 * Gets the Semantics service URL for the given request.
 *
 * @param from - The request.
 *
 * @returns The service URL.
 *
 * @internal
 */
export function getSemanticsServiceUrl(from: ExtraParamsRequest): string {
  return from.extraParams?.env === 'test'
    ? 'https://semantics-api.internal.test.empathy.co'
    : 'https://api.{extraParams.env(.)}empathy.co/semantics-api'
}

/**
 * Gets the Config service URL for the given request.
 *
 * @param from - The request.
 *
 * @returns The service URL.
 *
 * @internal
 */
export function getConfigServiceUrl(from: ExtraParamsRequest): string {
  return from.extraParams?.env === 'test'
    ? 'https://config-service.internal.test.empathy.co'
    : 'https://api.{extraParams.env(.)}empathy.co/config/v1'
}

/**
 * Returns the default headers for the endpoint adapters.
 * This function is SSR-friendly and will always include the x-origin header.
 * In a browser environment, it uses location.origin; otherwise, it uses a fallback string.
 *
 * @returns The default headers object.
 * @public
 */
export function getDefaultHeaders(): Record<string, string> {
  const headers: Record<string, string> = {}

  // Add x-origin header with location.origin if in browser, otherwise use fallback
  if (typeof window !== 'undefined' && typeof location !== 'undefined') {
    headers['x-origin'] = location.origin
  } else {
    headers['x-origin'] = 'non-browser'
  }

  return headers
}
