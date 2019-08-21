import { Suggestion } from '@empathy/search-types';
import { Container } from 'inversify';
import { SuggestionsResponse } from '../../types';
import {
  FromRequest,
  RequestMapper1,
  RequestMapper2,
  StaticHttpClient,
  SuggestionAsStringMapper,
  SuggestionMapper1,
  SuggestionMapper2
} from '../__mocks__/mappers.mocks';
import { ContainerConfigParser } from '../container/container-config-parser';
import { DEPENDENCIES } from '../container/container.const';
import { BindingDictionary } from '../container/container.types';
import { HttpClient } from '../http-clients/http-client.types';
import { EmpathySimpleValueMapper } from '../mappers';
import { FeatureRequestor } from '../requestors/feature.requestor';
import { EmpathyEndpointsService } from '../services/empathy-endpoints.service';
import clearAllMocks = jest.clearAllMocks;

const container = new Container({ defaultScope: 'Singleton' });
const hooks = { beforeRequest: jest.fn(), beforeResponseTransformed: jest.fn(), responseTransformed: jest.fn() };
const bindingDictionary: BindingDictionary = {
  Requestor: FeatureRequestor,
  MockedResponse: { toConstant: {} },
  [DEPENDENCIES.requestMappers]: [RequestMapper1, RequestMapper2],
  [DEPENDENCIES.httpClient]: StaticHttpClient,
  [DEPENDENCIES.endpointsService]: EmpathyEndpointsService,
  [DEPENDENCIES.Hooks.beforeRequest]: { toConstant: hooks.beforeRequest },
  [DEPENDENCIES.Hooks.beforeResponseTransformed]: { toConstant: hooks.beforeResponseTransformed },
  [DEPENDENCIES.Hooks.responseTransformed]: { toConstant: hooks.responseTransformed },
  [DEPENDENCIES.config]: {
    toConstant: {
      instance: 'demo',
      env: 'live',
      requestParams: { lang: 'en' }, features: {
        suggestions: {
          endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/empathize',
          responsePaths: {
            suggestions: 'data.suggestions'
          }
        },
        primitive: {
          endpoint: 'does-not-matter',
          responsePaths: {
            number: 'number',
            string: 'string',
            boolean: 'boolean'
          }
        }
      }
    }
  },
  [DEPENDENCIES.featureName]: { toConstant: 'suggestions' },
  [DEPENDENCIES.entityMappers]: {
    toConstant: {
      suggestions: [new SuggestionMapper1(), new SuggestionMapper2()],
      number: [new EmpathySimpleValueMapper()],
      boolean: [new EmpathySimpleValueMapper()],
      string: [new EmpathySimpleValueMapper()]
    }
  }
};

new ContainerConfigParser(bindingDictionary, container).parse();

beforeEach(() => {
  container.snapshot();
});

afterEach(() => {
  container.restore();
  clearAllMocks();
});

it('Maps request', () => {
  const requestor = container.get<FeatureRequestor<FromRequest, SuggestionsResponse>>('Requestor');
  const httpClient = container.get<HttpClient>(DEPENDENCIES.httpClient);
  const mockedGet = jest.fn(httpClient.get.bind(httpClient));
  httpClient.get = mockedGet as HttpClient['get'];

  requestor.request({ a: 'Hello', b: 'World' }, { requestId: 'ID' });

  expect(mockedGet).toHaveBeenCalledTimes(1);
  expect(mockedGet).toHaveBeenLastCalledWith(`https://api.empathybroker.com/search/v1/query/demo/empathize`
    , { a1: 'Hello', b1: 'World' }, { requestId: 'ID' });
});

it('Maps response primitive values', async () => {
  const mockedResponse = { data: { suggestions: 'cachopo' } };
  container.rebind('MockedResponse').toConstantValue(mockedResponse);
  container.rebind(DEPENDENCIES.entityMappers).toConstantValue({ suggestions: [new SuggestionAsStringMapper()] });
  const requestor = container.get<FeatureRequestor<FromRequest, SuggestionsResponse>>('Requestor');

  const { suggestions } = await requestor.request({ a: 'Hello', b: 'World' });

  expect(suggestions).toEqual(mockedResponse.data.suggestions);
});

it('Maps response object values', async () => {
  const mockedResponse = { data: { suggestions: 'cachopo' } };
  container.rebind('MockedResponse').toConstantValue(mockedResponse);
  const requestor = container.get<FeatureRequestor<FromRequest, SuggestionsResponse>>('Requestor');

  const { suggestions } = await requestor.request({ a: 'Hello', b: 'World' });

  expect(suggestions).toEqual({
    key: mockedResponse.data.suggestions,
    html: `<span>${ mockedResponse.data.suggestions }</span>`,
    facets: [],
    modelName: 'TermSuggestion',
    term: mockedResponse.data.suggestions
  });
});

it('Maps response array values', async () => {
  const mockedResponse = { data: { suggestions: ['cachopo', 'picadillo', 'txuletón'] } };
  container.rebind('MockedResponse').toConstantValue(mockedResponse);
  const requestor = container.get<FeatureRequestor<FromRequest, SuggestionsResponse>>('Requestor');

  const { suggestions } = await requestor.request({ a: 'Hello', b: 'World' });

  expect(suggestions).toEqual(mockedResponse.data.suggestions.map<Suggestion>(term => ({
    key: term,
    html: `<span>${ term }</span>`,
    facets: [],
    modelName: 'TermSuggestion',
    term
  })));
});

it('Maps falsy values', async () => {
  const mockedResponse = {
    number: 0,
    boolean: false,
    string: ''
  };
  container.rebind('MockedResponse').toConstantValue(mockedResponse);
  container.rebind('FeatureName').toConstantValue('primitive');
  const requestor = container.get<FeatureRequestor<{}, { number: number, boolean: boolean, string: string }>>('Requestor');

  const { number, boolean, string } = await requestor.request({});

  expect(number).toEqual(0);
  expect(boolean).toEqual(false);
  expect(string).toEqual('');
});

it('Calls single hooks', async () => {
  const requestor = container.get<FeatureRequestor<FromRequest, SuggestionsResponse>>('Requestor');

  await requestor.request({ a: 'Hello', b: 'World' });

  Object.values(hooks).forEach(hook => expect(hook).toHaveBeenCalledTimes(1));
});

it('Calls multiple hooks', async () => {
  const extraHooks = { beforeRequest: jest.fn(), beforeResponseTransformed: jest.fn(), responseTransformed: jest.fn() };
  container.bind(DEPENDENCIES.Hooks.beforeRequest).toFunction(extraHooks.beforeRequest);
  container.bind(DEPENDENCIES.Hooks.beforeResponseTransformed).toFunction(extraHooks.beforeResponseTransformed);
  container.bind(DEPENDENCIES.Hooks.responseTransformed).toFunction(extraHooks.responseTransformed);
  const requestor = container.get<FeatureRequestor<FromRequest, SuggestionsResponse>>('Requestor');

  await requestor.request({ a: 'Hello', b: 'World' });

  Object.values(hooks).forEach(hook => expect(hook).toHaveBeenCalledTimes(1));
  Object.values(extraHooks).forEach(hook => expect(hook).toHaveBeenCalledTimes(1));
});
