import { platformAdapter } from '@empathyco/x-adapter-platform';
import { SnippetConfig } from '../x-installer/api/api.types';
import { InstallXOptions } from '../x-installer/x-installer/types';
import { mockedAdapter } from '../adapter/mocked-adapter';
import { realAdapter } from '../adapter/real-adapter';
import { e2eAdapter } from '../adapter/e2e-adapter';

export const baseSnippetConfig: SnippetConfig = {
  instance: 'toysrus',
  lang: 'es',
  scope: 'x-components-development'
};

const adapter = 'Cypress' in window ? mockedAdapter : realAdapter;

const xModulesURLConfig = JSON.parse(new URL(location.href).searchParams.get('xModules') ?? '{}');

export const baseInstallXOptions: InstallXOptions = {
  adapter,
  platformAdapter: 'Cypress' in window ? e2eAdapter : platformAdapter,
  xModules: {
    identifierResults: {
      config: {
        identifierDetectionRegexp: '^[a-zA-Z][0-9]+'
      }
    },
    ...xModulesURLConfig
  }
};
