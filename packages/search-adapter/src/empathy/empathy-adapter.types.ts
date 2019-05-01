import { Adapter, EntityNames, RequestOptions } from '../models';
import { DeepPartial } from '../utils/utils.types';
import { EmpathyAdapterConfig } from './config/empathy-adapter-config.types';

export interface EmpathyAdapter extends Adapter {
  setConfig(config: DeepPartial<EmpathyAdapterConfig>): void;
}

export interface Requestor<RequestType = any, ResponseType = any> {
  request(params: RequestType, requestOptions?: RequestOptions): Promise<ResponseType>;
}

export interface Mapper<From = any, To = any> {
  map(from: From): To;
}

export type MappersProvider = (feature: string, entities: EntityNames[]) => Promise<Record<string, Mapper<any, any>>>;
