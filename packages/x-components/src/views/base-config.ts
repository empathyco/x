import { SnippetConfig } from '../x-installer/api/api.types';
import { InstallXOptions } from '../x-installer/x-installer/types';
import { adapter } from './adapter';

export const baseSnippetConfig: SnippetConfig = {
  instance: 'empathy',
  lang: 'en',
  env: 'staging',
  scope: 'x-components-development'
};

const xModulesURLConfig = JSON.parse(new URL(location.href).searchParams.get('xModules') ?? '{}');

export const baseInstallXOptions: InstallXOptions = {
  adapter,
  xModules: {
    ...xModulesURLConfig
  }
};
