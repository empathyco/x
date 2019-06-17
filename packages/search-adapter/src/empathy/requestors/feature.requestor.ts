import { getSafePropertyChain } from '@empathy/get-safe-property-chain';
import { inject, injectable, multiInject, optional } from 'inversify';
import { FeatureNames, RequestOptions } from '../../types';
import { Dictionary } from '../../utils/utils.types';
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
import { EndpointsService } from '../endpoints-services/endpoints-service.types';
import { EntityNames } from '../entities.types';
import { HttpClient } from '../http-clients/http-client.types';
import { pipeMappers } from '../mappers/pipe-mappers';

@injectable()
export class FeatureRequestor<RequestType, ResponseType extends Dictionary<any>> implements Requestor<RequestType, ResponseType> {
  protected mapRequest: MapRequest;
  protected responseMappers: Record<EntityNames, MapFn>;
  protected featureConfig: FeatureConfig<any>;

  constructor(
    @inject(DEPENDENCIES.config) readonly config: EmpathyAdapterConfig,
    @inject(DEPENDENCIES.featureName) private readonly feature: FeatureNames,
    @inject(DEPENDENCIES.httpClient) private readonly httpClient: HttpClient,
    @inject(DEPENDENCIES.endpointsService) private readonly endpointsService: EndpointsService,
    @multiInject(DEPENDENCIES.requestMappers) requestMappers: ResponseMapper[],
    @inject(DEPENDENCIES.entityMappers) mappers: Record<EntityNames, ResponseMapper[]>,
    @optional() @multiInject(DEPENDENCIES.Hooks.beforeRequest) private readonly beforeRequest: BeforeRequest[] = [],
    @optional() @multiInject(
      DEPENDENCIES.Hooks.beforeResponseTransformed) private readonly beforeResponseTransformed: BeforeResponseTransform[] = [],
    @optional() @multiInject(DEPENDENCIES.Hooks.responseTransformed) private readonly responseTransformed: ResponseTransformed[] = []
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
    const requestContext = { requestOptions, feature, url };
    const request = this.mapRequest(rawRequest, {}, requestContext);
    const beforeRequestContext = { ...requestContext, rawRequest, request };
    this.runHooks(this.beforeRequest, beforeRequestContext);
    return this.httpClient.get<Dictionary<any>, any>(url, request, requestOptions)
      .then(rawResponse => {
        const beforeResponseTransformedContext = { ...beforeRequestContext, rawRequest, request };
        this.runHooks(this.beforeResponseTransformed, beforeResponseTransformedContext);
        const responseContext = { ...beforeResponseTransformedContext, rawResponse };
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
        if (rawResponseSelection) {
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
