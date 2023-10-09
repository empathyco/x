import {
  PlatformAdapter,
  PlatformExperienceControlsResponse,
  experienceControlsResponseSchema,
  platformAdapter
} from '@empathyco/x-adapter-platform';
import { ExperienceControlsResponse } from '@empathyco/x-types';
import { e2eAdapter } from '../adapter/e2e-adapter';

export const adapterConfig = {
  e2e: 'Cypress' in window ? true : false
};

const experienceControlsAdapter = platformAdapter.experienceControls.extends({
  endpoint: 'https://config-service.internal.test.empathy.co/public/configs'
});

platformAdapter.experienceControls = experienceControlsAdapter;

experienceControlsResponseSchema.$override<
  PlatformExperienceControlsResponse,
  Partial<ExperienceControlsResponse>
>({
  events: response => ({
    SemanticQueryNewConfig: {
      threshold: (response.controls as any).semanticQueries.resultsPerCarousels as number | unknown,
      maxItemsToRequest: (response.controls as any).semanticQueries.numberOfCarousels as
        | number
        | unknown
    },
    SearchNewConfig: {
      pageSize: (response.controls as any).semanticQueries.resultsPerCarousels as number | unknown
    }
  })
});

export const adapter = new Proxy(platformAdapter, {
  get: (obj: PlatformAdapter, prop: keyof PlatformAdapter) =>
    adapterConfig.e2e ? e2eAdapter[prop] : obj[prop]
});
