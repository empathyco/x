import type { SnippetConfig } from '../x-installer/api/api.types'
import type { InstallXOptions } from '../x-installer/x-installer/types'
import { adapter } from './adapter'

export const baseSnippetConfig: SnippetConfig = {
  instance: 'cdl',
  lang: 'es',
  env: 'staging',
  scope: 'x-components-development',
}

// eslint-disable-next-line ts/no-unsafe-assignment
const xModulesURLConfig = JSON.parse(new URL(location.href).searchParams.get('xModules') ?? '{}')

export const baseInstallXOptions: InstallXOptions = {
  adapter,
  // eslint-disable-next-line ts/no-unsafe-assignment
  xModules: {
    ...xModulesURLConfig,
    facets: {
      config: {
        filtersStrategyForRequest: 'leaves-only',
      },
    },
  },
}
