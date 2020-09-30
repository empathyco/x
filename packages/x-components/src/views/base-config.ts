import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
import { Result } from '@empathy/search-types';
import { SnippetConfig } from '../x-installer/api/api.types';
import { InstallXOptions } from '../x-installer/x-installer/types';

const adapter = new EmpathyAdapterBuilder()
  .addMapper((_, result: Result) => {
    result.url = `./product_page.html?productId=${result.id}`;
    result.identifier.value = result.id;
    return result;
  }, 'results')
  .setFeatureConfig('search', {
    endpoint: 'https://api.empathybroker.com/search/v1/query/juguettos/searchv2'
  })
  .build();

export const baseSnippetConfig: SnippetConfig = {
  instance: 'juguettos',
  lang: 'es',
  scope: 'x-components-development'
};

export const baseInstallXOptions: InstallXOptions = {
  adapter,
  xModules: {
    identifierResults: {
      config: {
        identifierDetectionRegexp: '^[a-zA-Z][0-9]+'
      }
    }
  }
};
