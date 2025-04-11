import type { PlatformAdapter } from '@empathyco/x-adapter-platform'
import { platformAdapter } from '@empathyco/x-adapter-platform'
import { e2eAdapter } from '../adapter/e2e-adapter'

export const adapterConfig = {
  e2e: 'Cypress' in window,
}

const experienceControlsAdapter = platformAdapter.experienceControls.extends({
  endpoint: 'https://config-service.internal.test.empathy.co/public/configs',
})

platformAdapter.experienceControls = experienceControlsAdapter

export const adapter = new Proxy(platformAdapter, {
  get: (obj: PlatformAdapter, prop: keyof PlatformAdapter) =>
    adapterConfig.e2e ? e2eAdapter[prop] : obj[prop],
})
