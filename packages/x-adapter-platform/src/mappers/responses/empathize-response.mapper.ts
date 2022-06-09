import { createMutableSchema, Schema, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { EmpathizeResponse, PlatformEmpathizeResponse } from '../../types/response.types';
import { suggestionMutableSchema } from '../../schemas/suggestion.schema';

export const empathizeResponseSchema: Schema<PlatformEmpathizeResponse, EmpathizeResponse> = {
  suggestions: {
    $path: 'topTrends.content',
    $subSchema: suggestionMutableSchema
  },
  spellcheck: 'topTrends.spellcheck'
};

export const empathizeResponseMutableSchema = createMutableSchema(empathizeResponseSchema);

export const empathizeResponseMapper = schemaMapperFactory<
  PlatformEmpathizeResponse,
  EmpathizeResponse
>(empathizeResponseMutableSchema);
