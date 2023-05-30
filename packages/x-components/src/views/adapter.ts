import {
  PlatformAdapter,
  platformAdapter,
  semanticQueriesEndpointAdapter
} from '@empathyco/x-adapter-platform';
import { e2eAdapter } from '../adapter/e2e-adapter';

export const adapterConfig = {
  e2e: 'Cypress' in window ? true : false
};

// Provisional endpoint
// TODO: Remove this once the endpoint is deployed to the Empathy API.
platformAdapter.semanticQueries = semanticQueriesEndpointAdapter.extends({
  endpoint: 'https://semantics-api.internal.staging.empathy.co/search_single/{extraParams.instance}'
});

export const adapter = new Proxy(platformAdapter, {
  get: (obj: PlatformAdapter, prop: keyof PlatformAdapter) =>
    adapterConfig.e2e ? e2eAdapter[prop] : obj[prop]
});
