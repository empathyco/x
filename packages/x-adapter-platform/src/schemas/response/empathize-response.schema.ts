import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import {
  EmpathizeResponse,
  PlatformEmpathizeResponse
} from '../../types/responses/empathize-response.model';
import { suggestionMutableSchema } from '../suggestion.schema';

export const empathizeResponseSchema: Schema<PlatformEmpathizeResponse, EmpathizeResponse> = {
  suggestions: {
    $path: 'topTrends.content',
    $subSchema: suggestionMutableSchema
  },
  spellcheck: 'topTrends.spellcheck'
};

export const empathizeResponseMutableSchema = createMutableSchema(empathizeResponseSchema);
