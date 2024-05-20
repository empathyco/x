import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter';
import { RelatedTagsRequest, RelatedTagsResponse } from '@empathyco/x-types';
import { relatedTagsRequestMapper } from '../mappers/requests/related-tags-request.mapper';
import { relatedTagsResponseMapper } from '../mappers/responses/related-tags-response.mapper';
import { getBeaconServiceUrl } from './utils';

/**
 * This endpoint does not support pagination in the request.
 *
 * @public
 */
export const relatedTagsEndpointAdapter = endpointAdapterFactory<
  RelatedTagsRequest,
  RelatedTagsResponse
>({
  endpoint: from =>
    interpolate(`${getBeaconServiceUrl(from)}/relatedtags/{extraParams.instance}`, from),
  requestMapper: relatedTagsRequestMapper,
  responseMapper: relatedTagsResponseMapper,
  defaultRequestOptions: {
    id: 'related-tags',
    parameters: {
      internal: true
    }
  }
});
