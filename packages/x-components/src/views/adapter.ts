import { PlatformAdapter, platformAdapter } from '@empathyco/x-adapter-platform';
import { e2eAdapter } from '../adapter/e2e-adapter';

export const adapterConfig = {
  e2e: 'Cypress' in window ? true : false
};

const experienceControlsAdapter = platformAdapter.experienceControls.extends({
  endpoint: 'https://config-service.internal.test.empathy.co/public/configs'
});

const relatedPromptsAdapter = platformAdapter.relatedPrompts.extends({
  endpoint: 'https://api.empathy.co/relatedprompts/mymotivemarketplace?store=Labstore+London'
});

platformAdapter.experienceControls = experienceControlsAdapter;
platformAdapter.relatedPrompts = relatedPromptsAdapter;

export const adapter = new Proxy(platformAdapter, {
  get: (obj: PlatformAdapter, prop: keyof PlatformAdapter) =>
    adapterConfig.e2e ? e2eAdapter[prop] : obj[prop]
});
