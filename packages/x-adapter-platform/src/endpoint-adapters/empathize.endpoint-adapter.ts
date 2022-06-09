import { endpointAdapterFactory, EndpointAdapterOptions } from '@empathyco/x-adapter-next';
import { baseRequestMapper } from '../mappers/requests/base-request.mapper';
import { empathizeResponseMapper } from '../mappers/responses/empathize-response.mapper';
import { BaseRequest } from '../types/request.types';
import { EmpathizeResponse } from '../types/response.types';

const endpointAdapterOptions: EndpointAdapterOptions<BaseRequest, EmpathizeResponse> = {
  endpoint: 'https://api.{env(.)}empathy.co/search/v1/query/{instance}/empathize',
  responseMapper: empathizeResponseMapper,
  requestMapper: baseRequestMapper
};

export const empathizeEndpointAdapter = endpointAdapterFactory(endpointAdapterOptions);
