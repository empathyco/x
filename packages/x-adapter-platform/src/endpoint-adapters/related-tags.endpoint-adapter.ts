import { endpointAdapterFactory } from '@empathyco/x-adapter-next';
import { RelatedTagsRequest, RelatedTagsResponse } from '@empathyco/x-types';
import { relatedTagsRequestMapper } from '../mappers/request/related-tags-request.mapper';
import { relatedTagsResponseMapper } from '../mappers/response/related-tags-response.mapper';

export const relatedTagsEndpointAdapter = endpointAdapterFactory<
  RelatedTagsRequest,
  RelatedTagsResponse
>({
  endpoint: 'https://api.{env(.)}empathy.co/relatedtags/{instance}',
  requestMapper: relatedTagsRequestMapper,
  responseMapper: relatedTagsResponseMapper
});
