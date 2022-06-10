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
 * Interface for any `request` with `pagination`.
 *
 * @public
 */
export interface PlatformPageableRequest {
  rows?: number;
  start?: number;
}
