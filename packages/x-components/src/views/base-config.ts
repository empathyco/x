import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
import { Result } from '@empathy/search-types';

const adapter = new EmpathyAdapterBuilder()
  .setInstance('juguettos')
  .setLang('es')
  .setScope('x-components-development')
  .addMapper((_, result: Result) => {
    result.url = `./product_page.html?productId=${result.id}`;
    result.identifier.value = result.id;
    return result;
  }, 'results')
  .build();

const basicConfig = {
  adapter,
  xModules: {
    identifierResults: {
      config: {
        identifierDetectionRegexp: '^[a-zA-Z][0-9]+'
      }
    }
  }
};

export default basicConfig;
