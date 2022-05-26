import { platformAdapter } from '@empathyco/x-adapter-platform';
import { SnippetConfig } from '../x-installer/api/api.types';
import { InstallXOptions } from '../x-installer/x-installer/types';
import { e2eAdapter } from '../adapter/e2e-adapter';

export const baseSnippetConfig: SnippetConfig = {
  instance: 'empathy',
  lang: 'en',
  scope: 'x-components-development',
  env: 'staging'
};

const adapter = 'Cypress' in window ? e2eAdapter : platformAdapter;

const xModulesURLConfig = JSON.parse(new URL(location.href).searchParams.get('xModules') ?? '{}');

export const baseInstallXOptions: InstallXOptions = {
  adapter,
  xModules: {
    identifierResults: {
      config: {
        identifierDetectionRegexp: '^[a-zA-Z][0-9]+'
      }
    },
    ...xModulesURLConfig
  }
};
