import { inject, injectable, optional } from 'inversify';
import { Dictionary, RequestOptions } from '../../types';
import { DEPENDENCIES } from '../container/container.const';
import { CacheService } from '../services/cache-service.types';
import { RequestError } from './errors/request.error';
import { HttpClient } from './http-client.types';

@injectable()
export class FetchHttpClient implements HttpClient {
  protected requestsAbortControllers: Dictionary<AbortController> = {};

  constructor(
    @optional() @inject(DEPENDENCIES.cacheService) protected readonly cache?: CacheService
  ) {}

  get<T>(endpoint: string, params: Dictionary<any> = {}, { requestId = endpoint, ttlInMinutes = 0 }: RequestOptions = {}): Promise<T> {
    this.cancelPreviousRequest(requestId);
    const url = this.buildUrl(endpoint, params);
    const requestOptions = this.getRequestOptions(requestId);
    const cachedResponse = this.cache && this.cache.getItem(url);
    return cachedResponse
      ? Promise.resolve(cachedResponse)
      : fetch(url, requestOptions)
        .then(this.parseResponse)
        .then(this.storeInCache(url, ttlInMinutes));
  }

  protected parseResponse(response: Response): Promise<any> {
    if (response.ok) {
      return response.json();
    } else {
      throw new RequestError('Request failed', response);
    }
  }

  protected buildUrl(endpoint: string, params: Dictionary<any>): string {
    const url = new URL(endpoint);
    Object.entries(params).forEach(([key, param]) => {
      if (param !== undefined) {
        if (Array.isArray(param)) {
          param.forEach(arrayParamValue => url.searchParams.append(key, arrayParamValue));
        } else {
          url.searchParams.set(key, param);
        }
      }
    });
    return url.href;
  }

  protected cancelPreviousRequest(requestId: string): void {
    const previousRequest = this.requestsAbortControllers[requestId];
    if (previousRequest) {
      previousRequest.abort();
    }
  }

  protected getRequestOptions(requestId: string): RequestInit {
    if (typeof AbortController !== 'undefined') {
      const signal = this.createAbortController(requestId);
      return { signal };
    }
    return {};
  }

  protected createAbortController(requestId: string): AbortSignal {
    const controller = new AbortController();
    this.requestsAbortControllers[requestId] = controller;
    return controller.signal;
  }

  protected storeInCache<T>(url: string, ttlInMinutes: number): (response: T) => T {
    return (response: T) => {
      if (this.cache && ttlInMinutes) {
        this.cache.setItem(url, response, ttlInMinutes);
      }
      return response;
    };
  }
}
