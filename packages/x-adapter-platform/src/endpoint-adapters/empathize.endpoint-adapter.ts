import { endpointAdapterFactory, EndpointAdapterOptions } from '@empathyco/x-adapter-next';
import { BaseRequest } from '../types/request.types';
import { empathizeResponseMapper } from '../mappers/response/empathize-response.mapper';
import { EmpathizeResponse } from '../types';
import { baseRequestMapper } from '../mappers/request/base-request.mapper';

const endpointAdapterOptions: EndpointAdapterOptions<BaseRequest, EmpathizeResponse> = {
  endpoint: 'https://api.{env(.)}empathy.co/search/v1/query/{instance}/empathize',
  responseMapper: empathizeResponseMapper,
  requestMapper: baseRequestMapper
};

export const empathizeEndpointAdapter = endpointAdapterFactory(endpointAdapterOptions);
