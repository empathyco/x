import { EmpathyAdapterBuilder } from '@empathyco/x-adapter';
import { Result } from '@empathyco/x-types';

/**
 * Util function that adds configurations so the adapter built is using Juguettos' API.
 *
 * @param adapterBuilder - The adapter builder that will be creating the adapter.
 *
 * @returns An EmpathyAdapter ready to build.
 *
 * @internal
 */
export function configureAdapterWithJuguettos(
  adapterBuilder: EmpathyAdapterBuilder
): EmpathyAdapterBuilder {
  adapterBuilder
    .addMapper((_, result: Result) => {
      result.url = `./product_page.html?productId=${result.id}`;
      result.identifier.value = `${result.id}`;
      return result;
    }, 'results')
    .setFeatureConfig('search', {
      endpoint: 'https://api{env}.empathybroker.com/search/v1/query/juguettos/searchv2'
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
    );

  return adapterBuilder;
}
