import { Filter } from '../facet/filter/filter.model';
import { HierarchicalFilter } from '../facet/filter/hierarchical-filter.model';
import { NumberRangeFilter } from '../facet/filter/number-range-filter.model';
import { SimpleFilter } from '../facet/filter/simple-filter.model';

/**
 * Jest schema for validating Filter entities.
 *
 * @public
 */
export const FilterSchema: Filter = {
  id: expect.any(String),
  facetId: expect.any(String),
  label: expect.any(String),
  selected: expect.any(Boolean),
  value: expect.anything(),
  totalResults: expect.any(Number),
  callbackInfo: expect.any(Object),
  modelName: expect.any(String)
};

/**
 * Jest schema for validating SimpleFilter entity.
 *
 * @public
 */
export const SimpleFilterSchema: SimpleFilter = {
  ...FilterSchema,
  value: expect.any(String),
  modelName: 'SimpleFilter'
};

/**
 * Jest schema for validating HierarchicalFilter entity.
 *
 * @public
 */
export const HierarchicalFilterSchema: HierarchicalFilter = {
  ...FilterSchema,
  value: expect.any(String),
  parentId: expect.nullOr(String),
  children: expect.any(Array),
  modelName: 'HierarchicalFilter'
};

/**
 * Jest schema for validating NumberRangeFilter entity.
 *
 * @public
 */
export const NumberRangeFilterSchema: NumberRangeFilter = {
  ...FilterSchema,
  value: { min: expect.nullOr(Number), max: expect.nullOr(Number) },
  modelName: 'NumberRangeFilter'
};
