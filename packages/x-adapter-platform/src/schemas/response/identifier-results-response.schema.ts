import { Schema, createMutableSchema } from '@empathyco/x-adapter-next';
import { IdentifierResultsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformIdentifierResultsResponse } from '../../types/responses/identifier-results-response.model';
import { resultMutableSchema } from './models/result.schema';

export const identifierResultsResponseSchema: Schema<
  PlatformIdentifierResultsResponse,
  IdentifierResultsResponse
> = {
  results: {
    $path: 'catalog.content',
    $subSchema: resultMutableSchema
  }
};

export const identifierResultsResponseMutableSchema = createMutableSchema(
  identifierResultsResponseSchema
);
