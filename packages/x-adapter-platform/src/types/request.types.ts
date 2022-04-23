import { Filter } from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';

export interface SearchRequest {
  device: string;
  env: string;
  filters: Dictionary<Filter[]>;
  query: string;
  origin: string;
  relatedTags?: any[];
  rows: number;
  scope: string;
  sort: string;
  start: number;
  lang: string;
}

export interface PlatformSearchRequest {
  env: string;
  scope: string;
  device: string;
  origin: string;
  start: number;
  rows: number;
  query: string;
  lang: string;
  filter?: string[];
  sort?: string;
}
