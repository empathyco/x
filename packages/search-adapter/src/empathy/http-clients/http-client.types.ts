import { RequestOptions } from '../../types';

export interface HttpClient {
  get<Params, Response>(url: string, params?: Params, requestOptions?: RequestOptions): Promise<Response>;
}
