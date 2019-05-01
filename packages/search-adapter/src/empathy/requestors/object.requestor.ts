import { getSafePropertyChain } from '@empathy/get-safe-property-chain';
import { inject, injectable } from 'inversify';
import { EntityNames, FeatureNames, RequestOptions } from '../../models';
import { Dictionary } from '../../utils/utils.types';
import { EmpathyAdapterConfig } from '../config/empathy-adapter-config.types';
import { DEPENDENCIES } from '../container/empathy-adapter-container.const';
import { Mapper, MappersProvider, Requestor } from '../empathy-adapter.types';
import { HttpClient } from '../http-clients/http-client.model';

type EmpathyAdapterConfigFeatures = EmpathyAdapterConfig['features'][keyof EmpathyAdapterConfig['features']];

@injectable()
export class ObjectRequestor<RequestType, ResponseType> implements Requestor<RequestType, ResponseType> {

  private readonly featureConfig: EmpathyAdapterConfigFeatures;
  private mappers!: Record<string, Mapper<any, any>[]>;

  constructor(
    @inject(DEPENDENCIES.RequestParamsMapper) private  paramsBuilder: Mapper<any, Dictionary<any>>,
    @inject(DEPENDENCIES.httpClient) private httpClient: HttpClient,
    @inject(DEPENDENCIES.config) config: EmpathyAdapterConfig,
    @inject(DEPENDENCIES.feature) feature: FeatureNames,
    @inject(DEPENDENCIES.MappersProvider) mappersProvider: MappersProvider
  ) {
    this.featureConfig = config.features[feature];
    const entities = Object.keys(this.featureConfig.responsePath) as EntityNames[];
    mappersProvider(feature, entities).then((retrievedMappers) => this.mappers = retrievedMappers);
  }

  request(params: RequestType, requestOptions?: RequestOptions): Promise<ResponseType> {
    const parsedParams = this.paramsBuilder.map(params);
    return this.httpClient
      .get(this.featureConfig.endpoint, parsedParams, requestOptions)
      .then(this.transformResponse.bind(this));
  }

  private transformResponse(rawResponse: any): ResponseType {
    return Object.entries(this.featureConfig.responsePath)
      .reduce((transformedResponse, [entityName, rawResponsePath]) => {
        const rawResponsePart = getSafePropertyChain(rawResponse, rawResponsePath);
        const mapper = this.mappers[entityName];
        transformedResponse[entityName] =
          Array.isArray(rawResponsePart) ? mapper.map(rawResponsePart) : rawResponsePart.map(mapper.map.bind(mapper));
        return transformedResponse;
      }, {} as any) as ResponseType; // TODO Fix types
  }
}
