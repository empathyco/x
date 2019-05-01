import { injectable } from 'inversify';
import { HttpClient } from './http-client.model';

@injectable()
export class FetchHttpClient implements HttpClient {
  //  { requestId = endpoint }: RequestOptions = {}

  // TODO Implement requests cancelation.
  get<Response>(endpoint: string, params: Record<string, any> = {}): Promise<Response> {
    const url = this.buildUrl(endpoint, params);
    return fetch(url)
      .then((response) => response.json());
  }

  private buildUrl(endpoint: string, params: Record<string, any>): string {
    const url = new URL(endpoint);
    Object.entries(params).forEach(([key, param]) => {
      if (Array.isArray(param)) {
        param.forEach((arrayParamValue) => url.searchParams.append(key, arrayParamValue));
      } else {
        url.searchParams.set(key, param);
      }
    });
    return url.href;
  }
}
