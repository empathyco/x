import { deepMerge } from '@empathyco/x-deep-merge';
import { fetchHttpClient } from '../http-clients/fetch.http-client';
import { identityMapper } from '../mappers/identity.mapper';
import { Mapper } from '../mappers/types';
import { interpolate } from '../utils/interpolate';
import { EndpointAdapterFactory, EndpointAdapterOptions, ExtendableEndpointAdapter } from './types';

/**
 * Factory to create {@link ExtendableEndpointAdapter | endpoint adapters} with the given
 * {@link EndpointAdapterOptions | options}.
 *
 * @param options - The {@link EndpointAdapterOptions | options} to create a new
 * {@link ExtendableEndpointAdapter} with.
 *
 * @returns A brand new {@link ExtendableEndpointAdapter} object.
 * @public
 */
export const endpointAdapterFactory: EndpointAdapterFactory = <Request, Response>(
  options: EndpointAdapterOptions<Request, Response>
) => {
  const endpointAdapter: ExtendableEndpointAdapter<Request, Response> = (
    request,
    { endpoint: requestEndpoint, ...requestOptions } = {}
  ) => {
    const {
      endpoint: rawEndpoint,
      httpClient = fetchHttpClient,
      requestMapper = identityMapper,
      responseMapper = identityMapper,
      defaultRequestOptions = {}
    }: EndpointAdapterOptions<Request, Response> = options;

    const endpoint = getEndpoint(requestEndpoint ?? rawEndpoint, request);
    const requestParameters = requestMapper(request, { endpoint });

    return httpClient(
      endpoint,
      deepMerge({}, defaultRequestOptions, requestOptions, { parameters: requestParameters })
    ).then(response => responseMapper(response, { endpoint, requestParameters }));
  };

  endpointAdapter.extends = <NewRequest, NewResponse>(
    extendedOptions: Partial<EndpointAdapterOptions<NewRequest, NewResponse>>
  ) =>
    endpointAdapterFactory<NewRequest, NewResponse>({
      ...options,
      ...extendedOptions
    } as EndpointAdapterOptions<NewRequest, NewResponse>);

  return endpointAdapter;
};

/**
 * Returns an endpoint.
 *
 * @param endpoint - The endpoint to process.
 * @param request - The request object.
 *
 * @returns The endpoint.
 * @internal
 */
function getEndpoint<Request>(
  endpoint: string | Mapper<Request, string> | undefined,
  request: Request
): string {
  if (!endpoint) {
    throw Error('Tried to make a request without an endpoint');
  }

  return typeof endpoint === 'function'
    ? endpoint(request, {})
    : interpolate(endpoint, request as Record<string, unknown>);
}
