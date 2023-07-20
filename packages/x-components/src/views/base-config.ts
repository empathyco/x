import { SnippetConfig } from '../x-installer/api/api.types';
import { InstallXOptions } from '../x-installer/x-installer/types';
import { adapter } from './adapter';

export const baseSnippetConfig: SnippetConfig = {
  instance: 'tous',
  env: 'staging',
  scope: 'desktop',
  lang: 'es',
  uiLang: 'es',
  currency: 'EUR',
  consent: true,
  documentDirection: 'ltr',
  store: 'es',
  queriesPreview: [
    {
      query: 'oro blanco',
      title: 'Classics Forever'
    },
    {
      query: 'tous manifesto',
      title: 'Tous Manifesto Collection'
    }
  ]
};

const xModulesURLConfig = JSON.parse(new URL(location.href).searchParams.get('xModules') ?? '{}');

export const baseInstallXOptions: InstallXOptions = {
  adapter,
  xModules: {
    ...xModulesURLConfig,
    facets: {
      config: {
        filtersStrategyForRequest: 'leaves-only'
      }
    }
  }
};
