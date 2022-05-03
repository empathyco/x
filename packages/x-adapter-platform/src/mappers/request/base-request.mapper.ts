import { createMutableSchema, Schema, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { BaseRequest, PlatformBaseRequest } from '../../types/request.types';

export const baseRequestSchema: Schema<BaseRequest, PlatformBaseRequest> = {
  device: 'device',
  env: 'env',
  lang: 'lang',
  rows: 'rows',
  scope: 'scope',
  start: 'start',
  query: 'query',
  origin: 'origin'
};

export const baseRequestMutableSchema = createMutableSchema(baseRequestSchema);

export const baseRequestMapper = schemaMapperFactory<BaseRequest, PlatformBaseRequest>(
  baseRequestMutableSchema
);
