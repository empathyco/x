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

experienceControlsResponseSchema.$override<
  PlatformExperienceControlsResponse,
  Partial<ExperienceControlsResponse>
>({
  events: {
    SemanticQueryNewConfig: {
      threshols: 'resultsPerCarrousel',
      maxItemsToRequest: 'numberOfCarrousels'
    }
  }
});

export const adapter = new Proxy(platformAdapter, {
  get: (obj: PlatformAdapter, prop: keyof PlatformAdapter) =>
    adapterConfig.e2e ? e2eAdapter[prop] : obj[prop]
});
