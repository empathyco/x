import { PlatformExtraParamsRequest } from './request.types';

/**
 * Request for the `semantic queries` endpoint.
 * In this endpoint the `q` param is used to send the query.
 *
 * @public
 */
export interface PlatformSemanticQueriesRequest extends PlatformExtraParamsRequest {
  q: string;
}
