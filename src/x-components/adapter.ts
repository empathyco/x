import { EmpathyAdapterBuilder } from '@empathy/search-adapter';
import { Result } from '@empathy/search-types';

export const adapter = new EmpathyAdapterBuilder()
  .setInstance('juguettos')
  .setEnvironment('staging')
  .addMapper((_, result: Result) => {
    result.url = `./product_page.html?productId=${result.id.toString()}`;
    result.identifier.value = `${result.id.toString()}`;
    return result;
  }, 'results')
  .setFeatureConfig('search', {
    endpoint: 'https://api.empathybroker.com/search/v1/query/juguettos/searchv2'
  })
  .setFacetConfig(
    {
      modelName: 'HierarchicalFacet'
    },
    'hierarchical_category'
  )
  .setFacetConfig(
    {
      modelName: 'NumberRangeFacet',
      template: '<!tag=price_facet>priceSort:[<min> TO <max>]'
    },
    'price_facet'
  )
  .setLang('es')
  .setScope('desktop')
  .build();
