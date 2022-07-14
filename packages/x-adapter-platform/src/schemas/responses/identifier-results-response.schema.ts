import { Schema, createMutableSchema } from '@empathyco/x-adapter';
import { IdentifierResultsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformIdentifierResultsResponse } from '../../types/responses/identifier-results-response.model';
import { resultSchema } from '../models/result.schema';

export const identifierResultsResponseSchema = createMutableSchema<
  Schema<PlatformIdentifierResultsResponse, IdentifierResultsResponse>
>({
  results: {
    $path: 'catalog.content',
    $subSchema: resultSchema
  }
});
