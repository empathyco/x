import { Dictionary, RequestOptions } from '../../types';

export interface HttpClient {
  get<T>(url: string, params?: Dictionary<any>, requestOptions?: RequestOptions): Promise<T>;
}
