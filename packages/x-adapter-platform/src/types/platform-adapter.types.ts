import { Adapter, EndpointAdapter } from '@empathyco/x-adapter-next';
import { SearchResponse } from './response.types';
import { SearchRequest } from './request.types';

export interface PlatformAdapter extends Adapter {
  search: EndpointAdapter<SearchRequest, SearchResponse>;
}
