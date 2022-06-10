/**
 * Interface for any `request` with `extra parameters`.
 *
 * @public
 */
export interface PlatformExtraParamsRequest {
  extraParams: {
    [key: string]: unknown;
  };
}

/**
 * Interface for any `request` with a `query` parameter.
 *
 * @public
 */
export interface PlatformQueryableRequest {
  query: string;
}
