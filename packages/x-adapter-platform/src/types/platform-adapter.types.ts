import { Adapter, EndpointAdapter } from '@empathyco/x-adapter-next';
import { SearchResponse } from './response.types';

export interface PlatformAdapter extends Adapter {
  search: EndpointAdapter<SearchRequest, SearchResponse>;
}
