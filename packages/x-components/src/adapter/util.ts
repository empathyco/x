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
    .addMapper((_, result: Result) => {
      result.url = `./product_page/products/${result.id}`;
      result.identifier.value = `${result.id}`;
      result.rating = { value: Number(result.id.toString().slice(1)) % 6 };
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
