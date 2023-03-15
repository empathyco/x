import { createMutableSchema } from '@empathyco/x-adapter';
import { PartialResult } from '@empathyco/x-types';
import { PlatformPartialResult } from '../../types/models/partials.model';
import { resultSchema } from './result.schema';

/**
 * Default implementation for the PartialResultsSchema.
 *
 * @public
 */
export const partialResultsSchema = createMutableSchema<PlatformPartialResult, PartialResult>({
  query: 'term',
  results: {
    $path: 'content',
    $subSchema: resultSchema
  },
  totalResults: 'numFound'
});
