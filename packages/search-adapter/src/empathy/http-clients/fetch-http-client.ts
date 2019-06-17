import { injectable } from 'inversify';
import { RequestOptions } from '../../types';
import { Dictionary } from '../../utils/utils.types';
import { RequestError } from './errors/request.error';
import { HttpClient } from './http-client.types';

@injectable()
export class FetchHttpClient implements HttpClient {
  private requestsAbortControllers: Dictionary<AbortController> = {};

  get<Response>(endpoint: string, params: Dictionary<any> = {}, { requestId = endpoint }: RequestOptions = {}): Promise<Response> {
    this.cancelPreviousRequest(requestId);
    const url = this.buildUrl(endpoint, params);
    const requestOptions = this.getRequestOptions(requestId);
    return fetch(url, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new RequestError('Request failed', response);
        }
      });
  }

  private buildUrl(endpoint: string, params: Dictionary<any>): string {
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

  private cancelPreviousRequest(requestId: string): void {
    const previousRequest = this.requestsAbortControllers[requestId];
    if (previousRequest) {
      previousRequest.abort();
    }
  }

  private getRequestOptions(requestId: string): RequestInit {
    if ('AbortController' in window) {
      const signal = this.createAbortController(requestId);
      return { signal };
    }
    return {};
  }

  private createAbortController(requestId: string): AbortSignal {
    const controller = new AbortController();
    this.requestsAbortControllers[requestId] = controller;
    return controller.signal;
  }
}
