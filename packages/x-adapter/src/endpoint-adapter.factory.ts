import { RequestOptions } from './types/http-client.types';
import {
  EndpointAdapter,
  EndpointAdapterFactory,
  EndpointAdapterOptions
} from './types/adapter.types';

/**
 * Factory to create {@link EndpointAdapter | endpoint adapters} with the passed
 * {@link EndpointAdapterOptions | options}.
 *
 * @param options - The {@link EndpointAdapterOptions | options} to create a new
 * {@link EndpointAdapter} with.
 *
 * @returns A brand new {@link EndpointAdapter} object.
 * @public
 */
export const endpointAdapterFactory: EndpointAdapterFactory = <Request, Response>(
  options: EndpointAdapterOptions<Request, Response>
) => {
  /**
   * Local copy of the passed {@link EndpointAdapterOptions}, so they can be merged with the options
   * passed to {@link EndpointAdapter.extends}.
   */
  const adapterOptions = { ...options };

  const endpointAdapter: EndpointAdapter<Request, Response> = (request, requestOptions) => {
    const { endpoint: rawEndpoint, httpClient, requestMapper, responseMapper } = adapterOptions;

    /**
     * Returns a tuple with the endpoint to use, based on the {@link EndpointAdapterOptions} passed
     * to the factory and the {@link RequestOptions} passed to the {@link EndpointAdapter}, and the
     * passed {@link RequestOptions} omitting its endpoint.
     *
     * @remarks The endpoint to retrieve is based on the following checks:
     * * If it is a string it is returned directly.
     * * If it is a mapper function, the {@link RequestOptions.endpoint} is used as its `from`
     * parameter.
     * * In case any of the previous conditions are not met, the {@link RequestOptions.endpoint} is
     * used instead.
     * * If neither {@link EndpointAdapterOptions.endpoint} and {@link RequestOptions.endpoint} are
     * configured, an empty string is returned.
     *
     * @returns A tuple containing the endpoint to use and the passed {@link RequestOptions}
     * omitting its endpoint.
     * @internal
     */
    function getOptions(): [endpoint: string, requestOptions: Omit<RequestOptions, 'endpoint'>] {
      const { endpoint: requestOptionsEndpoint, ...restRequestOptions } = requestOptions ?? {};
      let endpoint = requestOptionsEndpoint ?? '';
      if (typeof rawEndpoint === 'string') {
        endpoint = rawEndpoint;
      } else if (typeof rawEndpoint === 'function') {
        endpoint = rawEndpoint(endpoint, {});
      }
      return [endpoint, restRequestOptions];
    }

    const [endpoint, restRequestOptions] = getOptions();
    /**
     * Object containing the {@link RequestOptions.parameters} used by the
     * {@link EndpointAdapterOptions.httpClient}.
     *
     * If {@link EndpointAdapterOptions.requestMapper} is defined, the request used is mapped.
     * Otherwise, we fall back to the original request.
     */
    const requestParameters =
      requestMapper?.(request, { endpoint }) ??
      (request as unknown as Record<string, string | boolean | number>);

    /**
     * Returns the response obtained by calling the {@link EndpointAdapterOptions.httpClient}.
     *
     * * If {@link EndpointAdapterOptions.httpClient} is defined:
     * * * If {@link EndpointAdapterOptions.responseMapper} is defined, the response is mapped.
     * * * Else, the raw response is returned.
     *
     * * Else, an empty object is returned as the response.
     */
    return (
      httpClient?.<Response>(endpoint, {
        ...restRequestOptions,
        parameters: requestParameters
      }).then(
        response => responseMapper?.(response, { endpoint, requestParameters }) ?? response
      ) ?? Promise.resolve({} as Response)
    );
  };

  endpointAdapter.extends = <NewRequest, NewResponse>(
    extendedOptions: Partial<EndpointAdapterOptions<NewRequest, NewResponse>>
  ) => {
    /**
     * Merge {@link EndpointAdapterOptions | extendedOptions} with the existing
     * {@link EndpointAdapterOptions | adapterOptions} into a new object.
     */
    const newOptions = { ...adapterOptions, ...extendedOptions } as EndpointAdapterOptions<
      Request & NewRequest,
      Response & NewResponse
    >;

    return endpointAdapterFactory<Request & NewRequest, Response & NewResponse>(newOptions);
  };

  return endpointAdapter;
};
