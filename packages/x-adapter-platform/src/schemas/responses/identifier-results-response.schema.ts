import { createMutableSchema } from '@empathyco/x-adapter';
import { IdentifierResultsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformIdentifierResultsResponse } from '../../types/responses/identifier-results-response.model';
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
