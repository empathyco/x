import { DeepPartial } from '../../types';
import { EmpathyAdapterBuilder } from '../builder/empathy-adapter.builder';
import { EmpathyAdapterConfig } from '../config/empathy-adapter-config.types';

export const BASE_TEST_CONFIG: DeepPartial<EmpathyAdapterConfig> = {
  instance: 'juguettos',
  env: 'staging',
  requestParams: { lang: 'es' },
  features: {
    nextQueries: { cacheTTLInMinutes: 0 },
    recommendations: { cacheTTLInMinutes: 0 },
    relatedTags: { cacheTTLInMinutes: 0 },
    search: { cacheTTLInMinutes: 0 },
    searchById: { cacheTTLInMinutes: 0 },
    suggestions: { cacheTTLInMinutes: 0 },
    track: { cacheTTLInMinutes: 0 }
  }
};

export const adapter = new EmpathyAdapterBuilder()
  .enableCache()
  .withConfiguration(BASE_TEST_CONFIG)
  .build();
