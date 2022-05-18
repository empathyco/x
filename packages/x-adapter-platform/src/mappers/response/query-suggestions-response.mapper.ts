import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { QuerySuggestionsResponse } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { querySuggestionsResponseMutableSchema } from '../../schemas/response/query-suggestions-response.schema';
// eslint-disable-next-line max-len
import { PlatformQuerySuggestionsResponse } from '../../types/responses/query-suggestions-response.model';

export const querySuggestionsResponseMapper = schemaMapperFactory<
  PlatformQuerySuggestionsResponse,
  QuerySuggestionsResponse
>(querySuggestionsResponseMutableSchema);
