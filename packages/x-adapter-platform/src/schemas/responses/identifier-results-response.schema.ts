import type { IdentifierResultsResponse } from '@empathyco/x-types';
import type { PlatformIdentifierResultsResponse } from '../../types/responses/identifier-results-response.model';
 
import { createMutableSchema } from '@empathyco/x-adapter';
import { resultSchema } from '../models/result.schema';

/**
 * Default implementation for the IdentifierResultsResponseSchema.
 *
 * @public
 */
export const identifierResultsResponseSchema = createMutableSchema<
  PlatformIdentifierResultsResponse,
  IdentifierResultsResponse
>({
  results: {
    $path: 'catalog.content',
    $subSchema: resultSchema
  }
});
