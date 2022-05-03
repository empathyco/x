import { endpointAdapterFactory, EndpointAdapterOptions } from '@empathyco/x-adapter-next';
import { BaseRequest, SkuSearchResponse } from '../types';
import { skuSearchResponseMapper } from '../mappers/response/sku-search-response.mapper';
import { baseRequestMapper } from '../mappers/request/base-request.mapper';

const skuSearchEndpointAdapterOptions: EndpointAdapterOptions<BaseRequest, SkuSearchResponse> = {
  endpoint: 'https://api.{env(.)}empathy.co/search/v1/query/{instance}/skusearch',
  responseMapper: skuSearchResponseMapper,
  requestMapper: baseRequestMapper
};

export const skuSearchEndpointAdapter = endpointAdapterFactory(skuSearchEndpointAdapterOptions);
