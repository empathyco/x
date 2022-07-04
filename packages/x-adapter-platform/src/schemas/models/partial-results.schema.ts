import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { PartialResult } from '@empathyco/x-types';
import { PlatformPartialResult } from '../../types/models/partials.model';
import { resultSchema } from './result.schema';

export const partialResultsSchema = createMutableSchema<
  Schema<PlatformPartialResult, PartialResult>
>({
  query: 'term',
  results: {
    $path: 'content',
    $subSchema: resultSchema
  },
  totalResults: 'numFound'
});
