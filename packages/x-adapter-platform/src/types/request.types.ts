import { Filter } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';

export interface BaseRequest {
  rows: number;
  start: number;
  env: string;
  scope: string;
  device: string;
  lang: string;
  instance: string;
  query?: string;
  origin?: string;
}

export interface PlatformBaseRequest {
  rows: number;
  start: number;
  env: string;
  scope: string;
  device: string;
  lang: string;
  query?: string;
  origin?: string;
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

export interface TaggingRequest {
  url: string;
  params: Record<string, string | number | boolean>;
}
