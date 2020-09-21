import { ConfigChangedListener, Dictionary, RequestOptions } from '../types';
import { EmpathyAdapterConfig } from './config/empathy-adapter-config.types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface Requestor<RequestType = any, ResponseType = any> {
  request(params: RequestType, requestOptions?: RequestOptions): Promise<ResponseType>;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface Mapper<From = any, To = any, Context = any> {
  map(from: From, to: To, context: Context): To;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface ResponseMapper<From = any, To = any> extends Mapper<From, To, Readonly<ResponseMapperContext>> {}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface RequestMapper<From = any, To = any> extends Mapper<From, To, Readonly<RequestMapperContext>> {}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface RequestMapperContext {
  readonly requestOptions: RequestOptions;
  /* The feature name from where this mapper has been invoked */
  readonly feature: string;
  /* The endpoint before applying the dynamic query parameters (query, filters...) */
  readonly url: string;
  [key: string]: any;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface ResponseMapperContext<RequestType = any, RawResponseType = any> extends RequestMapperContext {
  /* The request that the adapter has received */
  readonly rawRequest: Readonly<RequestType>;
  /* The raw response, as it comes from the API */
  readonly rawResponse: Readonly<RawResponseType>;
  /* The parsed request, which is the one sent to the API */
  readonly request: Dictionary<any>;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type MapFn<From = any, To = any, Context = any> = Mapper<From, To, Context>['map'];

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type MapRequest<From = any, To = any> = MapFn<From, To, RequestMapperContext>;

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type MapResponse<From = any, To = any> = MapFn<From, To, ResponseMapperContext>;

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type BeforeRequest<RawRequestType = any> =
  (context: BeforeRequestContext<RawRequestType>) => void;

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type BeforeResponseTransform<RawResponseType = any> =
  (context: BeforeResponseTransformContext<RawResponseType>) => void;

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type ResponseTransformed<RawResponseType = any, ResponseType = any> =
  (context: ResponseTransformedContext<RawResponseType, ResponseType>) => void;

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
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

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface BeforeResponseTransformContext<RawResponseType = any> extends BeforeRequestContext {
  /* The raw response, as it comes from the API */
  rawResponse: RawResponseType;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export interface ResponseTransformedContext<RawResponseType = any, ResponseType = any>
  extends BeforeResponseTransformContext<RawResponseType> {
  /* The transformed response */
  response: ResponseType;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export type EmpathyAdapterConfigChangedListener = ConfigChangedListener<EmpathyAdapterConfig>;
