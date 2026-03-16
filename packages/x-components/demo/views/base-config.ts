import type { SnippetConfig } from '../../src/x-installer/api/api.types'
import type { InstallXOptions } from '../../src/x-installer/types'
import { adapter } from './adapter'

export const baseSnippetConfig: SnippetConfig = {
  instance: 'empathy',
  lang: 'en',
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
