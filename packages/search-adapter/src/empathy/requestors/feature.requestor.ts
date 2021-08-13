import { getSafePropertyChain } from '@empathyco/x-get-safe-property-chain';
import { inject, injectable, multiInject, optional } from 'inversify';
import { Dictionary, FeatureNames, RequestOptions } from '../../types';
import { EmpathyAdapterConfig, FeatureConfig } from '../config/empathy-adapter-config.types';
import { DEPENDENCIES } from '../container/container.const';
import {
  BeforeRequest,
  BeforeRequestContext,
  BeforeResponseTransform,
  BeforeResponseTransformContext,
  MapFn,
  MapRequest,
  Requestor,
  ResponseMapper,
  ResponseMapperContext,
  ResponseTransformed,
  ResponseTransformedContext
} from '../empathy-adapter.types';
import { EntityNames } from '../entities.types';
import { HttpClient } from '../http-clients/http-client.types';
import { pipeMappers } from '../mappers/pipe-mappers';
import { EndpointsService } from '../services/endpoints-service.types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class FeatureRequestor<RequestType, ResponseType extends Dictionary<any>> implements Requestor<RequestType, ResponseType> {
  protected mapRequest: MapRequest;
  protected responseMappers: Record<EntityNames, MapFn>;
  protected featureConfig: FeatureConfig<any>;

  constructor(
    @inject(DEPENDENCIES.config) protected readonly config: EmpathyAdapterConfig,
    @inject(DEPENDENCIES.featureName) protected readonly feature: FeatureNames,
    @inject(DEPENDENCIES.httpClient) protected readonly httpClient: HttpClient,
    @inject(DEPENDENCIES.endpointsService) protected readonly endpointsService: EndpointsService,
    @multiInject(DEPENDENCIES.requestMappers) requestMappers: ResponseMapper[],
    @inject(DEPENDENCIES.entityMappers) mappers: Record<EntityNames, ResponseMapper[]>,
    @optional() @multiInject(DEPENDENCIES.Hooks.beforeRequest) protected readonly beforeRequest: BeforeRequest[] = [],
    @optional() @multiInject(
      DEPENDENCIES.Hooks.beforeResponseTransformed) protected readonly beforeResponseTransformed: BeforeResponseTransform[] = [],
    @optional() @multiInject(DEPENDENCIES.Hooks.responseTransformed) protected readonly responseTransformed: ResponseTransformed[] = []
  ) {
    this.mapRequest = pipeMappers(...requestMappers);
    this.featureConfig = config.features[feature];
    this.responseMappers = {} as Record<EntityNames, MapRequest>;
    Object.keys(this.featureConfig.responsePaths).forEach(entity => {
      this.responseMappers[entity as EntityNames] = pipeMappers(...mappers[entity as EntityNames]);
    }, {});
  }

  request(rawRequest: RequestType, requestOptions: RequestOptions = {}): Promise<ResponseType> {
    const feature = this.feature;
    const url = this.endpointsService.buildUrl(this.featureConfig.endpoint);
    if (requestOptions.ttlInMinutes === undefined) {
      requestOptions.ttlInMinutes = this.featureConfig.cacheTTLInMinutes;
    }
    const requestContext = { requestOptions, feature, url };
    const request = this.mapRequest(rawRequest, {}, requestContext);
    const beforeRequestContext = { ...requestContext, rawRequest, request };
    this.runHooks(this.beforeRequest, beforeRequestContext);
    return this.httpClient.get<any>(url, request, requestOptions)
      .then(rawResponse => {
        const responseContext = { ...beforeRequestContext, rawResponse };
        this.runHooks(this.beforeResponseTransformed, responseContext);
        const response = this.transformResponse(rawResponse, responseContext);
        const responseTransformedContext = { ...responseContext, response };
        this.runHooks(this.responseTransformed, responseTransformedContext);
        return response;
      });
  }

  protected runHooks(hooks: Function[], context: BeforeRequestContext | BeforeResponseTransformContext | ResponseTransformedContext) {
    hooks.forEach(hook => hook(context));
  }

  protected transformResponse(rawResponse: any, context: ResponseMapperContext): ResponseType {
    return Object.entries(this.featureConfig.responsePaths)
      .reduce((transformedResponse, [entityName, rawResponsePath]) => {
        const rawResponseSelection = getSafePropertyChain(rawResponse, rawResponsePath);
        if (rawResponseSelection !== undefined) {
          // @ts-ignore The error does not make sense: Record<string, any> cannot be indexed with type string???
          transformedResponse[entityName] = this.transformResponseSelection(rawResponseSelection, entityName as EntityNames, context);
        }
        return transformedResponse;
      }, {} as ResponseType);
  }

  protected transformResponseSelection(rawResponseSelection: any, entityName: EntityNames, context: ResponseMapperContext): any {
    const mapFn = this.responseMappers[entityName];
    return Array.isArray(rawResponseSelection)
      ? rawResponseSelection.map(rawEntity => mapFn(rawEntity, {}, context))
      : mapFn(rawResponseSelection, {}, context);
  }
}
