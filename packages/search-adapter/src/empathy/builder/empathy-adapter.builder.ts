import { deepMerge } from '@empathyco/x-deep-merge';
import { StorageService } from '@empathyco/x-storage-service';
import { UserInfo } from '@empathyco/x-types';
import { Container, injectable } from 'inversify';
import { DeepPartial, FeatureNames, Newable } from '../../types';
import { EmpathyAdapterConfig, FacetConfig, FeatureConfig } from '../config/empathy-adapter-config.types';
import { ContainerConfigParser } from '../container/container-config-parser';
import { BINDINGS } from '../container/container.bindings';
import { DEPENDENCIES } from '../container/container.const';
import {
  BeforeRequest,
  BeforeResponseTransform,
  MapRequest,
  MapResponse,
  RequestMapper,
  ResponseMapper,
  ResponseTransformed
} from '../empathy-adapter.types';
import { EmpathyAdapter } from '../empathy.adapter';
import { EntityNames } from '../entities.types';
import { Logger } from '../logger';
import { CacheService } from '../services/cache-service.types';
import { EmpathyCacheService } from '../services/empathy-cache.service';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @internal
 */
type ConfiguratorCallback = (container: Container) => void;

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @internal
 */
interface EnableCacheOptions {
  storageService?: StorageService;
  cacheService?: Newable<CacheService>;
}

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
export class EmpathyAdapterBuilder {
  protected configurator?: ConfiguratorCallback;
  protected config: EmpathyAdapterConfig;

  constructor(
    protected container = new Container(),
    protected defaultBindingsConfig = BINDINGS,
    protected adapterClass: Newable<EmpathyAdapter> = EmpathyAdapter
  ) {
    this.initContainerBindings();
    // There is only one config object. As it has been binded with inversify toConstant() method, we are just getting a reference to it here
    this.config = container.get(DEPENDENCIES.config);
  }

  enableCache({
    storageService = typeof localStorage !== 'undefined' ? new StorageService(localStorage) : undefined,
    cacheService = EmpathyCacheService
  }: EnableCacheOptions = {}): this {
    if (storageService && cacheService) {
      this.container.bind(DEPENDENCIES.storageService).toConstantValue(storageService);
      this.container.bind(DEPENDENCIES.cacheService).to(cacheService);
    } else {
      Logger.warn('Tried to enable cache with invalid options');
    }
    return this;
  }

  addClassMapper<Entity>(mapper: Newable<ResponseMapper<Entity>>, entity: EntityNames, feature?: FeatureNames): this {
    const mapperKey = DEPENDENCIES.ResponseMappers[entity];
    if (feature) {
      const requestorKey = DEPENDENCIES.Requestors[feature];
      this.container.bind(mapperKey).to(mapper).whenAnyAncestorIs(requestorKey);
    } else {
      this.container.bind(mapperKey).to(mapper);
    }
    return this;
  }

  addMapper(mapper: MapResponse, entity: EntityNames, feature?: FeatureNames): this {
    const mapperClass = this.createMapperClass(mapper);
    this.addClassMapper(mapperClass, entity, feature);
    return this;
  }

  replaceMapper(mapper: MapResponse, entity: EntityNames): this {
    const mapperClass = this.createMapperClass(mapper);
    this.replaceClassMapper(mapperClass, entity);
    return this;
  }

  replaceClassMapper<Entity>(mapper: Newable<ResponseMapper<Entity>>, entity: EntityNames): this {
    const mapperKey = DEPENDENCIES.ResponseMappers[entity];
    this.container.rebind(mapperKey).to(mapper);
    return this;
  }

  addClassRequestMapper<Entity>(mapper: Newable<ResponseMapper<Entity>>, feature?: FeatureNames): this {
    if (feature) {
      const requestorKey = DEPENDENCIES.Requestors[feature];
      this.container.bind(DEPENDENCIES.requestMappers).to(mapper).whenAnyAncestorIs(requestorKey);
    } else {
      this.container.bind(DEPENDENCIES.requestMappers).to(mapper);
    }
    return this;
  }

  addRequestMapper(mapper: MapResponse, feature?: FeatureNames): this {
    const mapperClass = this.createRequestMapperClass(mapper);
    this.addClassRequestMapper(mapperClass, feature);
    return this;
  }

  replaceRequestMapper(mapper: MapRequest): this {
    const mapperClass = this.createRequestMapperClass(mapper);
    this.replaceClassRequestMapper(mapperClass);
    return this;
  }

  replaceClassRequestMapper(mapper: Newable<RequestMapper>): this {
    this.container.rebind(DEPENDENCIES.requestMappers).to(mapper);
    return this;
  }

  onResponseTransformed<RawResponseType = any, ResponseType = any>(hook: ResponseTransformed<RawResponseType, ResponseType>,
    feature?: FeatureNames): this {
    return this.addHook(hook, 'responseTransformed', feature);
  }

  onBeforeRequest(hook: BeforeRequest, feature?: FeatureNames): this {
    return this.addHook(hook, 'beforeRequest', feature);
  }

  onBeforeResponseTransformed<RawResponseType = any>(hook: BeforeResponseTransform<RawResponseType>, feature?: FeatureNames): this {
    return this.addHook(hook, 'beforeResponseTransformed', feature);
  }

  configureContainer(configurator: ConfiguratorCallback): this {
    this.configurator = configurator;
    return this;
  }

  setRequestParams(requestParams: Record<string, string>) {
    Object.assign(this.config.requestParams, requestParams);
    return this;
  }

  setLang(lang: string): this {
    this.config.requestParams.lang = lang;
    return this;
  }

  setScope(scope: string): this {
    this.config.requestParams.scope = scope;
    return this;
  }

  setInstance(instance: string): this {
    this.config.instance = instance;
    return this;
  }

  setUserInfo(user: UserInfo): this {
    Object.assign(this.config.requestParams, user);
    return this;
  }

  setEnvironment(environment: EmpathyAdapterConfig['env']): this {
    this.config.env = environment;
    return this;
  }

  setFeatureConfig<Feature extends FeatureNames>(featureName: Feature, featureConfig: DeepPartial<FeatureConfig<Feature>>): this {
    deepMerge(this.config.features[featureName], featureConfig);
    return this;
  }

  setResultTrackingConfig(resultTrackingConfig: DeepPartial<EmpathyAdapterConfig['mappings']['tracking']['result']>): this {
    deepMerge(this.config.mappings.tracking.result, resultTrackingConfig);
    return this;
  }

  setFacetConfig(config: DeepPartial<FacetConfig>, facetId?: string): this {
    if (facetId) {
      const namedFacetsConfig = this.config.mappings.facets.named;
      if (!namedFacetsConfig[facetId]) {
        // We will complete the partial facet config in the build method, so we can cast this safely here.
        namedFacetsConfig[facetId] = config as FacetConfig;
      } else {
        deepMerge(namedFacetsConfig[facetId], config);
      }
    } else {
      deepMerge(this.config.mappings.facets.default, config);
    }
    return this;
  }

  setQueryConfig(queryConfig: DeepPartial<EmpathyAdapterConfig['mappings']['query']>): this {
    deepMerge(this.config.mappings.query, queryConfig);
    return this;
  }

  withConfiguration(config: DeepPartial<EmpathyAdapterConfig>): this {
    deepMerge(this.config, config);
    return this;
  }

  build(): EmpathyAdapter {
    if (this.configurator) {
      this.configurator(this.container);
    }

    this.completePartialFacetsConfig();
    return this.container.resolve(this.adapterClass);
  }

  protected initContainerBindings() {
    new ContainerConfigParser(this.defaultBindingsConfig, this.container).parse();
  }

  protected createMapperClass(mapFn: MapResponse): Newable<ResponseMapper> {
    return injectable()
    (class MockedMapper implements ResponseMapper {
      map = mapFn;
    });
  }

  protected createRequestMapperClass(mapFn: MapRequest): Newable<RequestMapper> {
    return injectable()
    (class MockedMapper implements RequestMapper {
      map = mapFn;
    });
  }

  protected addHook(hook: Function, hookName: keyof typeof DEPENDENCIES.Hooks, feature?: FeatureNames) {
    if (feature) {
      this.container.bind(DEPENDENCIES.Hooks[hookName]).toFunction(hook).whenInjectedInto(DEPENDENCIES.Requestors[feature]);
    } else {
      this.container.bind(DEPENDENCIES.Hooks[hookName]).toFunction(hook);
    }
    return this;
  }

  protected completePartialFacetsConfig(): void {
    const config = this.container.get<EmpathyAdapterConfig>(DEPENDENCIES.config);
    const facetsConfig = config.mappings.facets;
    Object.entries(facetsConfig.named).forEach(([facetId, namedFacetConfig]) => {
      facetsConfig.named[facetId] = deepMerge({}, facetsConfig.default, namedFacetConfig);
    });
  }
}
