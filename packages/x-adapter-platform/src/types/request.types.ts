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

export interface TaggingRequest {
  url: string;
  params: Record<string, string | number | boolean>;
}
