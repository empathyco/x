import { Schema } from '@empathyco/x-adapter-next';
import { FacetModelName, FilterModelName } from '@empathyco/x-types';

// export const facetFilterSchema: Schema<PlatformFacetFilter, any> = {
//   id: 'filter',
//   modelName: () => 'HierarchicalFilter',
//   selected: () => false,
//   filters: {
//     $path: 'children',
//     $subSchema: '$self'
//   },
//   label: 'value'
// };

export const facetSchema: Schema<any, any> = {
  id: ({ facet, filter }) => facet ?? filter,
  modelName: ({ facet, filter }) => {
    return facet ? getFacetType(facet) : getFilterType(filter);
  },
  filters: {
    $path: 'values',
    $subSchema: '$self'
  },
  label: ({ facet, value }) => facet ?? value,
  children: {
    $path: 'children',
    $subSchema: '$self'
  },
  selected: () => false
};

/**
 * Resolves the proper facet model name.
 *
 * @param facet - The facet to resolve the model name.
 * @returns The facet's model name.
 */
function getFacetType(facet: string): FacetModelName {
  const name = facet.split('_')[0];
  const hierarchicalFacet = ['categoryPaths'];
  const numberRangeFacet = ['price'];
  if (hierarchicalFacet.includes(name)) {
    return 'HierarchicalFacet';
  }
  if (numberRangeFacet.includes(name)) {
    return 'NumberRangeFacet';
  }
  return 'SimpleFacet';
}

/**
 * Resolves the proper filter model name.
 *
 * @param filter - The filter to resolve the model name.
 * @returns The filter's model name.
 */
function getFilterType(filter: string): FilterModelName {
  if (filter.startsWith('category')) {
    return 'HierarchicalFilter';
  }
  if (filter.startsWith('price')) {
    return 'NumberRangeFilter';
  }
  return 'SimpleFilter';
}
