// TODO: Check properties of this interface. Are they necessary?
export interface PlatformExtraParamsRequest {
  instance: string;
  env: string;
  lang: string;
  device: string;
  scope: string;
}

/**
 * Interface for any Request with a `filters` parameter.
 *
 * @public
 */
export interface PlatformFilterableRequest {
  filter?: string[];
}
