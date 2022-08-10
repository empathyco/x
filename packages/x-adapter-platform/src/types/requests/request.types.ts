/**
 * Interface for any `request` with `extra parameters`.
 *
 * @public
 */
export interface PlatformExtraParamsRequest {
  extraParams?: {
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

/**
 * Interface for any `request` with a `query` parameter.
 *
 * @public
 */
export interface PlatformQueryableRequest {
  query: string;
}

/**
 * Interface for any `request` with `sorting`.
 *
 * @public
 */
export declare interface PlatformSortableRequest {
  sort?: string;
}

/**
 * Interface for any `request` with `tagging`.
 *
 * @public
 */
export interface PlatformTrackableRequest {
  origin?: string;
}

/**
 * Interface for any `request` with `filters`.
 *
 * @public
 */
export interface PlatformFilterableRequest {
  filter?: string[];
}
