import { Filter } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';

export interface PlatformExtraParamsRequest {
  instance: string;
  env: string;
  lang: string;
  device: string;
  scope: string;
}

export interface SearchRequest extends BaseRequest {
  filters: Dictionary<Filter[]>;
  query: string;
  origin: string;
  relatedTags?: any[];
  sort: string;
  lang: string;
}

export interface PlatformSearchRequest extends PlatformBaseRequest {
  origin: string;
  query: string;
  filter?: string[];
  sort?: string;
}
