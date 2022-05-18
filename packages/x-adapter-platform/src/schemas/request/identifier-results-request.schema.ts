import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { IdentifierResultsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { BasePlatformIdentifierResultsRequest } from '../../types/requests/identifier-results-request.model';

export const identifierResultsRequestSchema: Schema<
  IdentifierResultsRequest,
  BasePlatformIdentifierResultsRequest
> = {
  query: 'query',
  origin: 'origin',
  start: 'start',
  rows: 'rows'
};

export const identifierResultsRequestMutableSchema = createMutableSchema(
  identifierResultsRequestSchema
);
