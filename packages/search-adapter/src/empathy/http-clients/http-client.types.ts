import { Dictionary, RequestOptions } from '../../types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface HttpClient {
  get<T>(url: string, params?: Dictionary<any>, requestOptions?: RequestOptions): Promise<T>;
}
