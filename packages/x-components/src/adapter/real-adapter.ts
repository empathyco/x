import { EmpathyAdapterBuilder } from '@empathyco/x-adapter';
import { Result } from '@empathyco/x-types-old';

export const realAdapter = new EmpathyAdapterBuilder()
  .addMapper((_, result: Result) => {
    result.url = `./product_page.html?productId=${result.id}`;
    result.identifier.value = `${result.id}`;
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
  .build();
