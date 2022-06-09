import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { QuerySuggestionsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { querySuggestionsRequestMutableSchema } from '../../schemas/request/query-suggestions.schema';
// eslint-disable-next-line max-len
import { PlatformQuerySuggestionsRequest } from '../../types/request/query-suggestions-request.model';

export const querySuggestionsRequestMapper = schemaMapperFactory<
  QuerySuggestionsRequest,
  PlatformQuerySuggestionsRequest
>(querySuggestionsRequestMutableSchema);
