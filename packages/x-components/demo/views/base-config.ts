import type { PlatformAdapter } from '@empathyco/x-adapter-platform'
import type { XModulesOptions } from '@x/plugins'
import type { InstallXOptions, SnippetConfig } from '@x/x-installer'
import { platformAdapter } from '@empathyco/x-adapter-platform'

export const baseSnippetConfig: SnippetConfig = {
  instance: 'empathy',
  lang: 'en',
  env: 'staging',
  scope: 'x-components-development',
}

const adapter = new Proxy(platformAdapter, {
  get: (obj, prop: keyof PlatformAdapter) => obj[prop],
})
const xModulesURLConfig = JSON.parse(
  new URL(location.href).searchParams.get('xModules') ?? '{}',
) as XModulesOptions | undefined

export const baseInstallXOptions: InstallXOptions = {
  adapter,
  xModules: {
    ...xModulesURLConfig,
    facets: {
      config: {
        filtersStrategyForRequest: 'leaves-only',
      },
    },
  },
}
