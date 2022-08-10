import { schemaMapperFactory } from '@empathyco/x-adapter';
import { QuerySuggestionsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { querySuggestionsRequestSchema } from '../../schemas/requests/query-suggestions-request.schema';
// eslint-disable-next-line max-len
import { PlatformQuerySuggestionsRequest } from '../../types/requests/query-suggestions-request.model';

export const querySuggestionsRequestMapper = schemaMapperFactory<
  QuerySuggestionsRequest,
  PlatformQuerySuggestionsRequest
>(querySuggestionsRequestSchema);
