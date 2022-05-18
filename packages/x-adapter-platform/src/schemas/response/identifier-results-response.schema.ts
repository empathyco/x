import { Schema, createMutableSchema } from '@empathyco/x-adapter-next';
import { IdentifierResultsResponse } from '@empathyco/x-types';
import { PlatformIdentifierResultsResponse } from '../../types';
import { resultMutableSchema } from '../result.schema';

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
