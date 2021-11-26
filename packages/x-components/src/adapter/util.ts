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
export function configureAdapterWithToysrus(
  adapterBuilder: EmpathyAdapterBuilder
): EmpathyAdapterBuilder {
  adapterBuilder
    .setFeatureConfig('relatedTags', {
      endpoint:
        // eslint-disable-next-line max-len
        'https://beacon-api.internal.test.empathy.co/relatedtags/empathy?rows=10&start=0&env=test&device=mobile&query=jeans&scope=desktop&lang=en',
      responsePaths: {
        relatedTags: 'data.relatedtags'
      }
    })
    .addMapper((_, result: Result) => {
      result.url = `./product_page.html?productId=${result.id}`;
      result.identifier.value = `${result.id}`;
      return result;
    }, 'results')
    .setFacetConfig(
      {
        modelName: 'HierarchicalFacet'
      },
      'categories_facet'
    )
    .setFacetConfig(
      {
        modelName: 'NumberRangeFacet',
        template: '<!tag=price>price:[<min> TO <max>]'
      },
      'price'
    );

  return adapterBuilder;
}
