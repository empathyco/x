import { EmpathyAdapterBuilder } from '../builder/empathy-adapter.builder';
import { EmpathyAdapterConfig } from '../config/empathy-adapter-config.types';
import { EmpathyAdapter } from '../empathy.adapter';

let adapter: EmpathyAdapter;

beforeEach(() => {
  adapter = new EmpathyAdapterBuilder().build();
});

it('Allows to add listeners that are notified when config changes', () => {
  const listener = jest.fn();
  adapter.addConfigChangedListener(listener);

  adapter.setConfig({ env: 'test', features: { search: { endpoint: 'https://google.es' } } });

  expect(listener).toHaveBeenCalledTimes(1);
  const expectedConfig: EmpathyAdapterConfig = {
    env: 'test',
    features: {
      search: {
        endpoint: 'https://google.es',
        responsePaths: expect.any(Object),
        cacheTTLInMinutes: expect.any(Number)
      },
      nextQueries: expect.any(Object),
      topRecommendations: expect.any(Object),
      sectionRecommendations: expect.any(Object),
      clicksRecommendations: expect.any(Object),
      queriesRecommendations: expect.any(Object),
      userRecommendations: expect.any(Object),
      relatedTags: expect.any(Object),
      searchById: expect.any(Object),
      suggestions: expect.any(Object),
      track: expect.any(Object)
    },
    mappings: expect.any(Object),
    instance: expect.any(String),
    requestParams: expect.any(Object)
  };
  expect(listener).toHaveBeenCalledWith(expectedConfig);
});

it('Allows to remove config listeners', () => {
  const listener = jest.fn();
  adapter.addConfigChangedListener(listener);
  adapter.removeConfigChangedListener(listener);

  adapter.setConfig({ env: 'test', features: { search: { endpoint: 'https://google.es' } } });

  expect(listener).toHaveBeenCalledTimes(0);
});
