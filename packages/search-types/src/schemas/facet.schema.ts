import { Facet } from '../facet/facet.model';
import { HierarchicalFacet } from '../facet/hierarchical-facet.model';
import { NumberRangeFacet } from '../facet/number-range-facet.model';
import { SimpleFacet } from '../facet/simple-facet.model';
import { FilterSchema, HierarchicalFilterSchema, NumberRangeFilterSchema, SimpleFilterSchema } from './filter.schema';

/**
 * Jest schema for validating Facet entities.
 *
 * @public
 */
export const FacetSchema: Facet = {
  id: expect.any(String),
  label: expect.any(String),
  filters: expect.arrayOfItemsMatching(FilterSchema),
  modelName: expect.any(String)
};

/**
 * Jest schema for validating SimpleFacet entity.
 *
 * @public
 */
export const SimpleFacetSchema: SimpleFacet = {
  ...FacetSchema,
  filters:  expect.arrayOfItemsMatching(SimpleFilterSchema),
  modelName: 'SimpleFacet'
};

/**
 * Jest schema for validating HierarchicalFacet entity.
 *
 * @public
 */
export const HierarchicalFacetSchema: HierarchicalFacet = {
  ...FacetSchema,
  filters:  expect.arrayOfItemsMatching(HierarchicalFilterSchema),
  modelName: 'HierarchicalFacet'
};

/**
 * Jest schema for validating NumberRangeFacet entity.
 *
 * @public
 */
export const NumberRangeFacetSchema: NumberRangeFacet = {
  ...FacetSchema,
  filters:  expect.arrayOfItemsMatching(NumberRangeFilterSchema),
  modelName: 'NumberRangeFacet'
};
