import { ConfigChangedListener, Dictionary, RequestOptions } from '../types';
import { EmpathyAdapterConfig } from './config/empathy-adapter-config.types';

export interface Requestor<RequestType = any, ResponseType = any> {
  request(params: RequestType, requestOptions?: RequestOptions): Promise<ResponseType>;
}

export interface Mapper<From = any, To = any, Context = any> {
  map(from: From, to: To, context: Context): To;
}

export interface ResponseMapper<From = any, To = any> extends Mapper<From, To, Readonly<ResponseMapperContext>> {}

export interface RequestMapper<From = any, To = any> extends Mapper<From, To, Readonly<RequestMapperContext>> {}

export interface RequestMapperContext {
  readonly requestOptions: RequestOptions;
  /* The feature name from where this mapper has been invoked */
  readonly feature: string;
  /* The endpoint before applying the dynamic query parameters (query, filters...) */
  readonly url: string;
  [key: string]: any;
}

export interface ResponseMapperContext<RequestType = any, RawResponseType = any> extends RequestMapperContext {
  /* The request that the adapter has received */
  readonly rawRequest: Readonly<RequestType>;
  /* The raw response, as it comes from the API */
  readonly rawResponse: Readonly<RawResponseType>;
  /* The parsed request, which is the one sent to the API */
  readonly request: Dictionary<any>;
}

export type MapFn<From = any, To = any, Context = any> = Mapper<From, To, Context>['map'];
export type MapRequest<From = any, To = any> = MapFn<From, To, RequestMapperContext>;
export type MapResponse<From = any, To = any> = MapFn<From, To, ResponseMapperContext>;

export type BeforeRequest<RawRequestType = any> =
  (context: BeforeRequestContext<RawRequestType>) => void;
export type BeforeResponseTransform<RawResponseType = any> =
  (context: BeforeResponseTransformContext<RawResponseType>) => void;
export type ResponseTransformed<RawResponseType = any, ResponseType = any> =
  (context: ResponseTransformedContext<RawResponseType, ResponseType>) => void;

export interface BeforeRequestContext<RawRequestType = any> {
  readonly requestOptions: RequestOptions;
  /* The feature name from where this hook has been invoked */
  readonly feature: string;
  /* The request that the adapter receives */
  rawRequest: RawRequestType;
  /* The parsed request, which is the one sent to the API */
  request: Dictionary<string>;
  /* The endpoint before applying the dynamic query parameters (query, filters...) */
  url: string;
  [key: string]: any;
}

export interface BeforeResponseTransformContext<RawResponseType = any> extends BeforeRequestContext {
  /* The raw response, as it comes from the API */
  rawResponse: RawResponseType;
}

export interface ResponseTransformedContext<RawResponseType = any, ResponseType = any>
  extends BeforeResponseTransformContext<RawResponseType> {
  /* The transformed response */
  response: ResponseType;
}

export type EmpathyAdapterConfigChangedListener = ConfigChangedListener<EmpathyAdapterConfig>;
