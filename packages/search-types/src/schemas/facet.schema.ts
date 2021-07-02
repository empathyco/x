import { EditableNumberRangeFacet } from '../facet/editable-number-range-facet.model';
import { Facet } from '../facet/facet.model';
import { HierarchicalFacet } from '../facet/hierarchical-facet.model';
import { NumberRangeFacet } from '../facet/number-range-facet.model';
import { SimpleFacet } from '../facet/simple-facet.model';
import {
  EditableNumberRangeFilterSchema,
  FilterSchema,
  HierarchicalFilterSchema,
  NumberRangeFilterSchema,
  SimpleFilterSchema
} from './filter.schema';
import { IdentifiableSchema } from './identifiable.schema';

/**
 * Jest schema for validating Facet entities.
 *
 * @public
 */
export const FacetSchema: Facet = {
  ...IdentifiableSchema,
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

/**
 * Jest schema for validating EditableNumberRangeFacet entity.
 *
 * @public
 */
export const EditableNumberRangeFacetSchema: EditableNumberRangeFacet = {
  ...FacetSchema,
  filters:  expect.arrayOfItemsMatching(EditableNumberRangeFilterSchema),
  modelName: 'EditableNumberRangeFacet'
};
