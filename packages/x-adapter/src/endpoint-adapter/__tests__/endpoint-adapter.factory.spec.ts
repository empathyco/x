import { endpointAdapterFactory } from '../endpoint-adapter.factory';
import { EndpointAdapterOptions, ExtendableEndpointAdapter } from '../types';
import { HttpClient, RequestOptions } from '../../http-clients/types';
import { identityMapper } from '../../mappers/identity.mapper';
import { Mapper } from '../../mappers/types';

/**
 * Creates an {@link ExtendableEndpointAdapter} using the {@link endpointAdapterFactory} with the
 * given {@link EndpointAdapterOptions}, exposing a basic API for testing.
 *
 * @param options - The CreateEndpointAdapterFactoryOptions to create the API with.
 *
 * @returns The API for testing the {@link ExtendableEndpointAdapter}.
 */
function createEndpointAdapterFactoryOptions<Request, Response>({
  options,
  rawResponse = {} as Response
}: CreateEndpointAdapterFactoryOptions<Request, Response> = {}): CreateEndpointAdapterFactoryAPI<
  Request,
  Response
> {
  const mockedHttpClient = jest.fn(() => Promise.resolve(rawResponse));
  const mockedRequestMapper = jest.fn(identityMapper);
  const mockedResponseMapper = jest.fn(identityMapper);

  const adapterOptions: EndpointAdapterOptions<Request, Response> = {
    endpoint: 'https://api.empathy.co/test',
    httpClient: mockedHttpClient as HttpClient,
    requestMapper: mockedRequestMapper,
    responseMapper: mockedResponseMapper,
    ...options
  };
  const endpointAdapter = endpointAdapterFactory<Request, Response>(adapterOptions);

  return {
    endpointAdapter,
    options: adapterOptions,
    mockedHttpClient,
    mockedRequestMapper,
    mockedResponseMapper
  };
}

describe('adapterFactory tests', () => {
  const request: TestRequest = { q: 'patata' };

  it('should create an endpointAdapter with the given options', async () => {
    const rawResponse: TestResponse = { query: 'patata' };
    const {
      endpointAdapter,
      options,
      mockedHttpClient,
      mockedRequestMapper,
      mockedResponseMapper
    } = createEndpointAdapterFactoryOptions<TestRequest, TestResponse>({
      rawResponse
    });

    expect(endpointAdapter).toBeDefined();
    expect(endpointAdapter).toHaveProperty('extends');

    const response = await endpointAdapter(request);

    expect(mockedRequestMapper).toHaveBeenCalledTimes(1);
    expect(mockedHttpClient).toHaveBeenCalledTimes(1);
    expect(mockedHttpClient).toHaveBeenCalledWith(options.endpoint, {
      parameters: request
    });
    expect(mockedResponseMapper).toHaveBeenCalledTimes(1);
    expect(response).toEqual(rawResponse);
  });

  // eslint-disable-next-line max-len
  it('should extend the endpointAdapter options with new ones, leaving the extended endpointAdapter untouched', async () => {
    const {
      endpointAdapter,
      options,
      mockedHttpClient,
      mockedRequestMapper,
      mockedResponseMapper
    } = createEndpointAdapterFactoryOptions<TestRequest, TestResponse>();

    const extendedEndpoint = 'https://api.empathy.co/extended';
    const extendedRawResponse = { extendedQuery: 'patata', extendedHits: 10 };
    const mockExtendedHttpClient = jest.fn(() => Promise.resolve(extendedRawResponse));
    const mockExtendedRequestMapper = jest.fn(({ q, origin }: ExtendedTestRequest) => ({
      extendedQuery: q,
      extendedOrigin: origin
    }));
    const mockExtendedResponseMapper = jest.fn(
      ({ extendedQuery, extendedHits }): ExtendedTestResponse => ({
        query: extendedQuery,
        hits: extendedHits
      })
    );

    const extendedEndpointAdapter = endpointAdapter.extends<
      ExtendedTestRequest,
      ExtendedTestResponse
    >({
      endpoint: extendedEndpoint,
      httpClient: mockExtendedHttpClient as HttpClient,
      requestMapper: mockExtendedRequestMapper,
      responseMapper: mockExtendedResponseMapper
    });

    const extendedRequest: ExtendedTestRequest = { q: 'patata', origin: 'extended' };
    const extendedResponse = await extendedEndpointAdapter(extendedRequest);
    const response = await endpointAdapter(request);

    expect(mockedRequestMapper).toHaveBeenCalledTimes(1);
    expect(mockedRequestMapper).toHaveBeenCalledWith(request, {
      endpoint: options.endpoint
    });

    expect(mockedHttpClient).toHaveBeenCalledTimes(1);
    expect(mockedHttpClient).toHaveBeenCalledWith(options.endpoint, {
      parameters: request
    });
    expect(mockedResponseMapper).toHaveBeenCalledTimes(1);
    expect(mockedResponseMapper).toHaveBeenCalledWith(
      {},
      {
        endpoint: options.endpoint,
        requestParameters: request
      }
    );
    expect(response).toEqual({});

    const mappedExtendedRequest = {
      extendedQuery: extendedRequest.q,
      extendedOrigin: extendedRequest.origin
    };
    expect(mockExtendedRequestMapper).toHaveBeenCalledTimes(1);
    expect(mockExtendedRequestMapper).toHaveBeenCalledWith(extendedRequest, {
      endpoint: extendedEndpoint
    });
    expect(mockExtendedRequestMapper).toHaveReturnedWith(mappedExtendedRequest);

    expect(mockExtendedHttpClient).toHaveBeenCalledTimes(1);
    expect(mockExtendedHttpClient).toHaveBeenCalledWith(extendedEndpoint, {
      parameters: mappedExtendedRequest
    });

    const extendedMappedResponse: ExtendedTestResponse = {
      query: 'patata',
      hits: 10
    };
    expect(mockExtendedResponseMapper).toHaveBeenCalledTimes(1);
    expect(mockExtendedResponseMapper).toHaveBeenCalledWith(extendedRawResponse, {
      endpoint: extendedEndpoint,
      requestParameters: mappedExtendedRequest
    });
    expect(mockExtendedResponseMapper).toHaveReturnedWith(extendedMappedResponse);
    expect(extendedResponse).toEqual(extendedMappedResponse);
  });

  it('should use the raw request if no requestMapper is provided', async () => {
    const { endpointAdapter, options, mockedHttpClient, mockedRequestMapper } =
      createEndpointAdapterFactoryOptions<TestRequest, TestResponse>({
        options: {
          requestMapper: undefined
        }
      });

    await endpointAdapter(request);

    expect(mockedRequestMapper).not.toHaveBeenCalled();
    expect(mockedHttpClient).toHaveBeenCalledTimes(1);
    expect(mockedHttpClient).toHaveBeenCalledWith(options.endpoint, {
      parameters: request
    });
  });

  it('should return the raw response if no responseMapper is provided', async () => {
    const rawResponse: TestResponse = { query: 'patata' };
    const { endpointAdapter, mockedHttpClient, mockedResponseMapper } =
      createEndpointAdapterFactoryOptions<TestRequest, TestResponse>({
        options: {
          responseMapper: undefined
        },
        rawResponse
      });

    const response = await endpointAdapter(request);

    expect(mockedHttpClient).toHaveBeenCalledTimes(1);
    expect(mockedResponseMapper).not.toHaveBeenCalled();
    expect(response).toEqual(rawResponse);
  });

  describe('endpoint scenarios', () => {
    it('should interpolate the endpoint using the request when it is a string', async () => {
      const { endpointAdapter, mockedHttpClient } = createEndpointAdapterFactoryOptions<
        TestRequest,
        TestResponse
      >({
        options: {
          endpoint: 'https://api{(-)env}.empathy.co/test'
        }
      });

      await endpointAdapter({ ...request, env: 'test' });

      expect(mockedHttpClient).toHaveBeenCalledTimes(1);
      expect(mockedHttpClient).toHaveBeenCalledWith(
        'https://api-test.empathy.co/test',
        expect.anything()
      );
    });

    // eslint-disable-next-line max-len
    it('should map the request to an endpoint when the provided endpoint is a function', async () => {
      const endpoint: Mapper<TestRequest, string> = ({ env }) =>
        env === 'test' ? 'api.internal.test.empathy.co/test' : 'api.empathy.co/test';
      const { endpointAdapter, mockedHttpClient } = createEndpointAdapterFactoryOptions<
        TestRequest,
        TestResponse
      >({
        options: {
          endpoint
        }
      });

      await endpointAdapter({ ...request, env: 'test' });

      expect(mockedHttpClient).toHaveBeenCalledTimes(1);
      expect(mockedHttpClient).toHaveBeenCalledWith(
        'api.internal.test.empathy.co/test',
        expect.anything()
      );
    });

    it('should use the requestOptions.endpoint if it is provided', async () => {
      const { endpointAdapter, mockedHttpClient } = createEndpointAdapterFactoryOptions<
        TestRequest,
        TestResponse
      >();
      const requestOptions: RequestOptions = {
        endpoint: 'https://api.empathy.co/staging'
      };

      await endpointAdapter(request, requestOptions);

      expect(mockedHttpClient).toHaveBeenCalledTimes(1);
      expect(mockedHttpClient).toHaveBeenCalledWith(requestOptions.endpoint, expect.anything());
    });
  });
});

interface CreateEndpointAdapterFactoryOptions<Request, Response> {
  /** The {@link EndpointAdapterOptions} passed to {@link endpointAdapterFactory} function. */
  options?: Partial<EndpointAdapterOptions<Request, Response>>;
  /** The raw response of calling the {@link ExtendableEndpointAdapter}. */
  rawResponse?: Response;
}

interface CreateEndpointAdapterFactoryAPI<Request, Response> {
  /** The created {@link ExtendableEndpointAdapter} by the {@link endpointAdapterFactory}. */
  endpointAdapter: ExtendableEndpointAdapter<Request, Response>;
  /** The options passed to {@link endpointAdapterFactory} function. */
  options: EndpointAdapterOptions<Request, Response>;
  /** The mocked {@link EndpointAdapterOptions.httpClient}. */
  mockedHttpClient: jest.Mock;
  /** The mocked {@link EndpointAdapterOptions.requestMapper}. */
  mockedRequestMapper: jest.Mock;
  /** The mocked {@link EndpointAdapterOptions.responseMapper}. */
  mockedResponseMapper: jest.Mock;
}

interface TestRequest {
  /** The query. */
  q: string;
  /** The environment. */
  env?: string;
}

interface TestResponse {
  /** The query. */
  query: string;
}

interface ExtendedTestRequest extends TestRequest {
  /** The origin. */
  origin: string;
}

interface ExtendedTestResponse extends TestResponse {
  /** The amount of matching results. */
  hits: number;
}
