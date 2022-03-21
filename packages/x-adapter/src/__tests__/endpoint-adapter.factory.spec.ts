import { endpointAdapterFactory } from '../endpoint-adapter.factory';
import { EndpointAdapter, EndpointAdapterOptions } from '../types/adapter.types';
import { HttpClient, RequestOptions } from '../types/http-client.types';
import { Mapper } from '../types/mapper.types';

/**
 * Creates an {@link EndpointAdapter} using the {@link endpointAdapterFactory} with the given
 * {@link EndpointAdapterOptions}, exposing a basic API for testing.
 *
 * @param options - The CreateEndpointAdapterFactoryOptions to create the API with.
 *
 * @returns The API for testing the {@link EndpointAdapter}.
 */
function createEndpointAdapterFactoryOptions<Request, Response>(
  {
    options,
    rawResponse = {} as Response
  }: CreateEndpointAdapterFactoryOptions<Request, Response> = {
    rawResponse: {} as Response
  }
): CreateEndpointAdapterFactoryAPI<Request, Response> {
  const mockedHttpClient = jest.fn(() => Promise.resolve(rawResponse));
  const mockedRequestMapper = jest.fn(from => ({ ...from }));
  const mockedResponseMapper = jest.fn(from => ({ ...from }));

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

  it('should extend the initial endpointAdapter options with the new ones', async () => {
    const { endpointAdapter } = createEndpointAdapterFactoryOptions<TestRequest, TestResponse>();

    const extendedEndpoint = 'https://api.empathy.co/extended';
    const extendedRawResponse = { extendedQuery: 'patata', extendedHits: 10 };
    const mockExtendedHttpClient = jest.fn(() => {
      return new Promise(resolve => resolve(extendedRawResponse));
    });
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

    const extendedRequest: ExtendedTestRequest = { q: 'patata', origin: 'extended' };
    const mappedExtendedRequest = {
      extendedQuery: extendedRequest.q,
      extendedOrigin: extendedRequest.origin
    };
    const extendedResponse: ExtendedTestResponse = {
      query: 'patata',
      hits: 10
    };

    // Even though we could test this using the endpointAdapter, this assignment is needed so
    // typings work as expected.
    const extendedEndpointAdapter = endpointAdapter.extends<
      ExtendedTestRequest,
      ExtendedTestResponse
    >({
      endpoint: extendedEndpoint,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      httpClient: mockExtendedHttpClient,
      requestMapper: mockExtendedRequestMapper,
      responseMapper: mockExtendedResponseMapper
    });

    const response = await extendedEndpointAdapter(extendedRequest);

    expect(mockExtendedRequestMapper).toHaveBeenCalledTimes(1);
    expect(mockExtendedRequestMapper).toHaveBeenCalledWith(extendedRequest, {
      endpoint: extendedEndpoint
    });
    expect(mockExtendedRequestMapper).toHaveReturnedWith(mappedExtendedRequest);

    expect(mockExtendedHttpClient).toHaveBeenCalledTimes(1);
    expect(mockExtendedHttpClient).toHaveBeenCalledWith(extendedEndpoint, {
      parameters: mappedExtendedRequest
    });

    expect(mockExtendedResponseMapper).toHaveBeenCalledTimes(1);
    expect(mockExtendedResponseMapper).toHaveBeenCalledWith(extendedRawResponse, {
      endpoint: extendedEndpoint,
      requestParameters: mappedExtendedRequest
    });
    expect(mockExtendedResponseMapper).toHaveReturnedWith(extendedResponse);
    expect(response).toEqual(extendedResponse);
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
    // eslint-disable-next-line max-len
    it('should use the provided EndpointAdapterOptions.endpoint directly when it is a string', async () => {
      const { endpointAdapter, options, mockedHttpClient } = createEndpointAdapterFactoryOptions<
        TestRequest,
        TestResponse
      >();

      await endpointAdapter(request);

      expect(mockedHttpClient).toHaveBeenCalledTimes(1);
      expect(mockedHttpClient).toHaveBeenCalledWith(options.endpoint, {
        parameters: request
      });
    });

    // eslint-disable-next-line max-len
    it('should combine the provided EndpointAdapterOptions.endpoint with the requestOptions.endpoint when the former is a function', async () => {
      const requestOptions: RequestOptions = {
        endpoint: 'https://api.empathy.co/test'
      };
      const endpoint: Mapper<string, string> = from => from.replace(/test/g, 'mapped');
      const expectedEndpoint = endpoint(requestOptions.endpoint!, {});
      const { endpointAdapter, mockedHttpClient } = createEndpointAdapterFactoryOptions<
        TestRequest,
        TestResponse
      >({
        options: {
          endpoint
        }
      });

      await endpointAdapter(request, requestOptions);

      expect(mockedHttpClient).toHaveBeenCalledTimes(1);
      expect(mockedHttpClient).toHaveBeenCalledWith(expectedEndpoint, {
        parameters: request
      });
    });

    // eslint-disable-next-line max-len,jest/no-disabled-tests
    it('should use the requestOptions.endpoint if no EndpointAdapterOptions.endpoint is provided', async () => {
      const requestOptions: RequestOptions = {
        endpoint: 'https://api.empathy.co/requestOptionsEndpoint'
      };
      const { endpointAdapter, mockedHttpClient } = createEndpointAdapterFactoryOptions<
        TestRequest,
        TestResponse
      >({
        options: {
          endpoint: undefined
        }
      });

      await endpointAdapter(request, requestOptions);

      expect(mockedHttpClient).toHaveBeenCalledTimes(1);
      expect(mockedHttpClient).toHaveBeenCalledWith(requestOptions.endpoint, {
        parameters: request
      });
    });
  });
});

interface CreateEndpointAdapterFactoryOptions<Request, Response> {
  /** The {@link EndpointAdapterOptions} passed to {@link endpointAdapterFactory} function. */
  options?: Partial<EndpointAdapterOptions<Request, Response>>;
  /** The raw response of calling the {@link EndpointAdapter}. */
  rawResponse?: Response;
}

interface CreateEndpointAdapterFactoryAPI<Request, Response> {
  /** The created {@link EndpointAdapter} by the {@link endpointAdapterFactory}. */
  endpointAdapter: EndpointAdapter<Request, Response>;
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
