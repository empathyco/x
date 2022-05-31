import { endpointAdapterFactory } from '@empathyco/x-adapter-next';
import { RelatedTagsRequest, RelatedTagsResponse } from '@empathyco/x-types';
import { relatedTagsRequestMapper } from '../mappers/request/related-tags-request.mapper';
import { relatedTagsResponseMapper } from '../mappers/response/related-tags-response.mapper';

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
  responseMapper: relatedTagsResponseMapper
});
