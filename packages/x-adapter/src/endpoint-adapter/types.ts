import { HttpClient, RequestOptions } from '../http-clients/types';
import { Mapper } from '../mappers/types';

/**
 * Connects with a given API endpoint. Transforms the request object into something the API
 * can understand, makes the request, and transforms back the API response into the desired shape.
 *
 * @public
 */
export interface EndpointAdapter<Request, Response> {
  /**
   * Triggers a request with the given data.
   *
   * @param request - The initial source request object.
   * @param options - Additional options to make the request with.
   * @returns A response promise.
   */
  (request: Request, options?: RequestOptions): Promise<Response>;
}

/**
 * Adds extends functionality to an {@link EndpointAdapter}.
 *
 * @public
 */
export interface ExtendableEndpointAdapter<Request, Response>
  extends EndpointAdapter<Request, Response> {
  /**
   * Extends the endpoint adapter, merging its options with the new ones, creating a new
   * {@link ExtendableEndpointAdapter} object.
   *
   * @param options - New options to extend the {@link ExtendableEndpointAdapter} with.
   * @returns A new adapter created by merging the new and old options.
   */
  extends: <NewRequest = Request, NewResponse = Response>(
    options: Partial<EndpointAdapterOptions<NewRequest, NewResponse>>
  ) => ExtendableEndpointAdapter<NewRequest, NewResponse>;
}

/**
 * Creates an {@link ExtendableEndpointAdapter} with the given options.
 *
 * @param options - Options to create the endpoint adapter with.
 * @returns A brand-new {@link ExtendableEndpointAdapter} instance.
 * @public
 */
export type EndpointAdapterFactory = <Request, Response>(
  options: EndpointAdapterOptions<Request, Response>
) => ExtendableEndpointAdapter<Request, Response>;

/**
 * Options to create an adapter with.
 *
 * @public
 */
export interface EndpointAdapterOptions<Request, Response> {
  /**
   * The endpoint to request the information to. If the endpoint can only be decided at run-time you
   * can ignore this property and use {@link RequestOptions.endpoint} parameter.
   */
  endpoint?: string | Mapper<Request, string>;
  /**
   * The {@link HttpClient} to use for the requests.
   */
  httpClient?: HttpClient;
  /**
   * The default {@link RequestOptions} to use every request.
   */
  defaultRequestOptions?: Omit<RequestOptions, 'endpoint'>;
  /**
   * The {@link Mapper} in charge of adapting the request object so the backend API can
   * understand it.
   */
  requestMapper?: Mapper<Request, Record<string, any>>;
  /**
   * The {@link Mapper} in charge of adapting the response object to whatever format or
   * shape it is needed.
   */
  responseMapper?: Mapper<any, Response>;
}
