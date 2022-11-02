import { bannerSchema, PlatformBanner } from '@empathyco/x-adapter-platform';
import { Banner } from '@empathyco/x-types';
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

bannerSchema.$override<PlatformBanner, Partial<Banner>>({
  tagging: {
    click: {
      url: () => 'https://jsonplaceholder.typicode.com/todos/1',
      params: () => Object.assign({})
    }
  }
});

export const baseInstallXOptions: InstallXOptions = {
  adapter,
  xModules: {
    ...xModulesURLConfig
  }
};
