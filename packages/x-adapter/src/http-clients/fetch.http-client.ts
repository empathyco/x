import { Dictionary, forEach } from '@empathyco/x-utils';
import { HttpClient, RequestError, RequestOptions } from '../types/http-client.types';

const requestsAbortControllers: Dictionary<AbortController> = {};

export const fetchHttpClient: HttpClient = (
  endpoint,
  { id = endpoint, parameters, properties } = {} as RequestOptions
) => {
  cancelPreviousRequest(id);
  const url = buildUrl(endpoint, parameters);
  const requestOptions = getRequestOptions(id, properties);
  return fetch(url, requestOptions).then(parseResponse);
};

function parseResponse(response: Response): Promise<any> {
  if (response.ok) {
    return response.json();
  } else {
    throw new RequestError('Request failed', response);
  }
}

function cancelPreviousRequest(requestId?: string): void {
  if (requestId) {
    requestsAbortControllers[requestId]?.abort();
  }
}

function buildUrl(endpoint: string, params?: Dictionary): string {
  const url = new URL(endpoint);
  forEach(params, (key, value) =>
    (Array.isArray(value) ? value : [value]).forEach(arrayItemValue =>
      url.searchParams.append(key, arrayItemValue)
    )
  );
  return url.href;
}

function getRequestOptions(requestId: string, properties?: RequestInit): RequestInit {
  requestsAbortControllers[requestId] = new AbortController();
  return { ...properties, signal: requestsAbortControllers[requestId].signal };
}
