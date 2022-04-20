import { Adapter, EndpointAdapter } from '@empathyco/x-adapter-next';
import { PlatformSearchResponse } from './response.types';
import { PlatformSearchRequest } from './request.types';

export interface PlatformAdapter extends Adapter {
  search: EndpointAdapter<PlatformSearchRequest, PlatformSearchResponse>;
}
