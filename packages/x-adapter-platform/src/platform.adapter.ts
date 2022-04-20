import { searchEndpointAdapter } from './endpoint-adapters/search.endpoint-adapter';
import { PlatformAdapter } from './types/platform-adapter.types';

export const platformAdapter: PlatformAdapter = {
  search: searchEndpointAdapter
};
