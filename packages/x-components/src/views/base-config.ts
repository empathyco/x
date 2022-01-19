import { SnippetConfig } from '../x-installer/api/api.types';
import { InstallXOptions } from '../x-installer/x-installer/types';
import { mockedAdapter } from '../adapter/mocked-adapter';
import { realAdapter } from '../adapter/real-adapter';

export const baseSnippetConfig: SnippetConfig = {
  instance: 'toysrus',
  lang: 'es',
  scope: 'x-components-development'
};

const url = new URL(location.href);

const adapter = url.searchParams.has('useMockedAdapter') ? (mockedAdapter as any) : realAdapter;

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
