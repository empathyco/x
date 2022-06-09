import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { QuerySuggestionsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { querySuggestionsRequestMutableSchema } from '../../schemas/requests/query-suggestions.schema';
// eslint-disable-next-line max-len
import { PlatformQuerySuggestionsRequest } from '../../types/requests/query-suggestions-request.model';

export const querySuggestionsRequestMapper = schemaMapperFactory<
  QuerySuggestionsRequest,
  PlatformQuerySuggestionsRequest
>(querySuggestionsRequestMutableSchema);
