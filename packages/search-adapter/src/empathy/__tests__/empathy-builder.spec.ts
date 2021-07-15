import { Container } from 'inversify';
import { FeatureNames } from '../../types';
import { CustomRequestMapper, CustomRequestor, CustomResultMapper } from '../__mocks__/empathy-builder.mocks';
import { EmpathyAdapterBuilder } from '../builder/empathy-adapter.builder';
import { EmpathyAdapterConfig } from '../config/empathy-adapter-config.types';
import { DEPENDENCIES } from '../container/container.const';
import {
  BeforeRequest,
  BeforeResponseTransform,
  RequestMapper,
  RequestMapperContext,
  Requestor,
  ResponseMapper,
  ResponseMapperContext,
  ResponseTransformed
} from '../empathy-adapter.types';
import { EmpathyAdapter } from '../empathy.adapter';

let container: Container, builder: EmpathyAdapterBuilder;

beforeEach(() => {
  container = new Container();
  builder = new EmpathyAdapterBuilder(container);
});
it('Generates a valid adapter with zero config', () => {
  const adapter = builder.build();
  expect(adapter).toBeInstanceOf(EmpathyAdapter);
});

it('Allows you to add global mappers', () => {
  builder.addClassMapper(CustomResultMapper, 'results')
    .build();
  const mappers = container.getAll<ResponseMapper>(DEPENDENCIES.ResponseMappers.results);
  expect(mappers.find(mapper => mapper instanceof CustomResultMapper)).toBeDefined();
  expect(mappers.length).toBeGreaterThanOrEqual(2);
});

it('Allows you to add mappers to a single feature', () => {
  builder
    .configureContainer(() => {
      container.rebind(DEPENDENCIES.Requestors.topRecommendations).to(CustomRequestor);
      container.rebind(DEPENDENCIES.Requestors.search).to(CustomRequestor);
    })
    .addClassMapper(CustomResultMapper, 'results', 'topRecommendations')
    .build();

  const recommendationsRequestor = getRequestor<CustomRequestor>('topRecommendations');
  const recommendationsResultMappers: ResponseMapper[] = recommendationsRequestor.mappers.results;
  expect(recommendationsResultMappers.length).toBeGreaterThanOrEqual(2);
  expect(recommendationsResultMappers.find(mapper => mapper instanceof CustomResultMapper)).toBeDefined();

  const searchRequestor = getRequestor<CustomRequestor>('search');
  const searchResultMappers: ResponseMapper[] = searchRequestor.mappers.results;
  expect(searchResultMappers.find(mapper => mapper instanceof CustomResultMapper)).toBeUndefined();
});

it('Allows you to override mappers globally', () => {
  builder.replaceClassMapper(CustomResultMapper, 'results')
    .build();
  const mappers = container.getAll<ResponseMapper>(DEPENDENCIES.ResponseMappers.results);
  expect(mappers[0]).toBeInstanceOf(CustomResultMapper);
  expect(mappers).toHaveLength(1);
});

it('Allows you to add request global mappers', () => {
  builder.addClassRequestMapper(CustomRequestMapper)
    .build();
  const mappers = container.getAll<RequestMapper>(DEPENDENCIES.requestMappers);
  expect(mappers.find(mapper => mapper instanceof CustomRequestMapper)).toBeDefined();
  expect(mappers.length).toBeGreaterThanOrEqual(2);
});

it('Allows you to add request mappers to a single feature', () => {
  builder
    .configureContainer(() => {
      container.rebind(DEPENDENCIES.Requestors.topRecommendations).to(CustomRequestor);
      container.rebind(DEPENDENCIES.Requestors.search).to(CustomRequestor);
    })
    .addClassRequestMapper(CustomRequestMapper, 'topRecommendations')
    .build();

  const recommendationsRequestor = getRequestor<CustomRequestor>('topRecommendations');
  expect(recommendationsRequestor.requestMappers.length).toBeGreaterThanOrEqual(2);
  expect(recommendationsRequestor.requestMappers.find(requestMapper => requestMapper instanceof CustomRequestMapper)).toBeDefined();

  const searchRequestor = getRequestor<CustomRequestor>('search');
  expect(searchRequestor.requestMappers.find(requestMapper => requestMapper instanceof CustomRequestMapper)).toBeUndefined();
});

it('Allows you to override request mappers globally', () => {
  builder.replaceClassRequestMapper(CustomRequestMapper)
    .build();
  const mappers = container.getAll<ResponseMapper>(DEPENDENCIES.requestMappers);
  expect(mappers[0]).toBeInstanceOf(CustomRequestMapper);
  expect(mappers).toHaveLength(1);
});

it('Allows you to perform dark magic tricks by accessing directly the container', () => {
  builder.configureContainer((builderContainer => builderContainer.rebind(DEPENDENCIES.ResponseMappers.results).to(CustomResultMapper)))
    .build();
  const mappers = container.getAll<ResponseMapper>(DEPENDENCIES.ResponseMappers.results);
  expect(mappers[0]).toBeInstanceOf(CustomResultMapper);
  expect(mappers).toHaveLength(1);
});

it('Allows to add mappers as functions', () => {
  const spellcheckSimpleMapper = () => 'Fuck yeah!';
  builder
    .addMapper(spellcheckSimpleMapper, 'spellcheck');

  const mappers = container.getAll<ResponseMapper>(DEPENDENCIES.ResponseMappers.spellcheck);
  const spellcheckMapper = mappers.find(mapper => mapper.map === spellcheckSimpleMapper);
  if (spellcheckMapper) {
    const spellcheckResult = spellcheckMapper.map('Does not matter', 'Does not matter', {} as ResponseMapperContext);
    expect(spellcheckResult).toEqual('Fuck yeah!');
  }

  expect(spellcheckMapper).toBeDefined();
  expect(mappers.length).toBeGreaterThan(1);
});

it('Allows to replace mappers as functions', () => {
  builder
    .replaceMapper(() => 'Hell yeah!', 'spellcheck');

  const mappers = container.getAll<ResponseMapper>(DEPENDENCIES.ResponseMappers.spellcheck);
  const spellcheckResult = mappers[0].map('Does not matter', 'Does not matter', {} as ResponseMapperContext);

  expect(mappers).toHaveLength(1);
  expect(spellcheckResult).toEqual('Hell yeah!');
});

it('Allows to add request mappers as functions', () => {
  const requestSimpleMapper = () => ({ a: 1 });
  builder
    .addRequestMapper(requestSimpleMapper);

  const mappers = container.getAll<RequestMapper>(DEPENDENCIES.requestMappers);
  const requestMapper = mappers.find(mapper => mapper.map === requestSimpleMapper);
  if (requestMapper) {
    const requestResult = requestMapper.map('Does not matter', {}, {} as RequestMapperContext);
    expect(requestResult).toEqual({ a: 1 });
  }

  expect(requestMapper).toBeDefined();
  expect(mappers.length).toBeGreaterThan(1);
});

it('Allows to replace request mappers as functions', () => {
  const requestSimpleMapper = () => ({ a: 1 });
  builder
    .replaceRequestMapper(requestSimpleMapper);

  const mappers = container.getAll<RequestMapper>(DEPENDENCIES.requestMappers);
  const requestResult = mappers[0].map('Does not matter', {}, {} as RequestMapperContext);

  expect(mappers).toHaveLength(1);
  expect(requestResult).toEqual({ a: 1 });
});

it('Allows you to add hooks', () => {
  const onBeforeRequest: BeforeRequest = () => {};
  const onBeforeResponseTransform: BeforeResponseTransform = () => {};
  const onResponseTransformed: ResponseTransformed = () => {};

  builder
    .onBeforeRequest(onBeforeRequest)
    .onBeforeResponseTransformed(onBeforeResponseTransform)
    .onResponseTransformed(onResponseTransformed);

  expect(container.get(DEPENDENCIES.Hooks.beforeRequest)).toBe(onBeforeRequest);
  expect(container.get(DEPENDENCIES.Hooks.beforeResponseTransformed)).toBe(onBeforeResponseTransform);
  expect(container.get(DEPENDENCIES.Hooks.responseTransformed)).toBe(onResponseTransformed);
});

it('Allows you to add hooks to a single feature', () => {
  const onBeforeRequest: BeforeRequest = () => {};

  builder
    .configureContainer(() => {
      container.rebind(DEPENDENCIES.Requestors.topRecommendations).to(CustomRequestor);
      container.rebind(DEPENDENCIES.Requestors.search).to(CustomRequestor);
    })
    .onBeforeRequest(onBeforeRequest, 'topRecommendations');

  const recommendationsRequestor = container.get<CustomRequestor>(DEPENDENCIES.Requestors.topRecommendations);
  const searchRequestor = container.get<CustomRequestor>(DEPENDENCIES.Requestors.search);

  expect(recommendationsRequestor.beforeRequest[0]).toEqual(onBeforeRequest);
  expect(searchRequestor.beforeRequest).toHaveLength(0);
});

it('Allows to override default configuration with helpers', () => {
  builder
    .setEnvironment('test')
    .setInstance('custom-instance')
    .setLang('ast')
    .setScope('desktop')
    .setUserInfo({
      session: 'random-session-id',
      user: 'random-user-id',
      userType: 'new'
    })
    .setRequestParams({ zone: 'Asturias' })
    .build();

  const config = container.get<EmpathyAdapterConfig>(DEPENDENCIES.config);

  expect(config.instance).toEqual('custom-instance');
  expect(config.env).toEqual('test');
  expect(config.requestParams.lang).toEqual('ast');
  expect(config.requestParams.scope).toEqual('desktop');
  expect(config.requestParams.session).toEqual('random-session-id');
  expect(config.requestParams.user).toEqual('random-user-id');
  expect(config.requestParams.userType).toEqual('new');
  expect(config.requestParams.zone).toEqual('Asturias');
});

it('Allows to modify and extend default features configuration', () => {
  const config = container.get<EmpathyAdapterConfig>(DEPENDENCIES.config);
  const defaultEndpoint = config.features.search.endpoint;
  const defaultResultsPath = config.features.search.responsePaths.results;

  builder
    .setFeatureConfig('search', {
      responsePaths: {
        banners: 'customBanners',
        newProperty: 'newProperty'
      }
    })
    .build();

  expect(config.features.search.endpoint).toEqual(defaultEndpoint);
  expect(config.features.search.responsePaths.results).toEqual(defaultResultsPath);
  expect(config.features.search.responsePaths.banners).toEqual('customBanners');
  expect(config.features.search.responsePaths.newProperty).toEqual('newProperty');
});

it('Allows to modify result tracking config', () => {
  const config = container.get<EmpathyAdapterConfig>(DEPENDENCIES.config);

  builder
    .setResultTrackingConfig({
      add2cart: 'new.path'
    })
    .build();

  expect(config.mappings.tracking.result.add2cart).toEqual('new.path');
});

it('Allows to modify query tracking config', () => {
  const config = container.get<EmpathyAdapterConfig>(DEPENDENCIES.config);

  builder
    .setQueryConfig({
      maxLength: 64
    })
    .build();

  expect(config.mappings.query.maxLength).toEqual(64);
});

it('Allows enabling the cache', () => {
  builder
    .enableCache()
    .build();

  expect(container.get(DEPENDENCIES.cacheService)).toBeDefined();
});

function getRequestor<RequestorType extends Requestor>(feature: FeatureNames): RequestorType {
  return container.get<RequestorType>(DEPENDENCIES.Requestors[feature]);
}
