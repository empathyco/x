import { PlatformExtraParamsRequest } from './request.types';

export interface PlatformSemanticQueriesRequest extends PlatformExtraParamsRequest {
  q: string;
}
