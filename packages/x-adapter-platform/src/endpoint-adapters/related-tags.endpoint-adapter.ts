import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { RelatedTagsRequest, RelatedTagsResponse } from '@empathyco/x-types';
import { relatedTagsRequestMapper } from '../mappers/requests/related-tags-request.mapper';
import { relatedTagsResponseMapper } from '../mappers/responses/related-tags-response.mapper';

/**
 * This endpoint does not support pagination in the request.
 *
 * @public
 */
export const relatedTagsEndpointAdapter = endpointAdapterFactory<
  RelatedTagsRequest,
  RelatedTagsResponse
>({
  endpoint: 'https://api.{extraParams.env(.)}empathy.co/relatedtags/{extraParams.instance}',
  requestMapper: relatedTagsRequestMapper,
  responseMapper: relatedTagsResponseMapper,
  defaultRequestOptions: {
    id: 'related-tags'
  }
});
