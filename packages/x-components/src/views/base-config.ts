import { platformAdapter } from '@empathyco/x-adapter-platform';
import { SnippetConfig } from '../x-installer/api/api.types';
import { InstallXOptions } from '../x-installer/x-installer/types';
import { e2eAdapter } from '../adapter/e2e-adapter';

export const baseSnippetConfig: SnippetConfig = {
  instance: 'empathy',
  lang: 'en',
  env: 'staging',
  scope: 'x-components-development'
};

const adapter = 'Cypress' in window ? e2eAdapter : platformAdapter;

const xModulesURLConfig = JSON.parse(new URL(location.href).searchParams.get('xModules') ?? '{}');

export const baseInstallXOptions: InstallXOptions = {
  adapter,
  xModules: {
    ...xModulesURLConfig
  }
};
