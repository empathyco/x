import { EditableNumberRangeFilter } from '../facet/filter';
import { BooleanFilter } from '../facet/filter/boolean-filter.model';
import { Filter } from '../facet/filter/filter.model';
import { HierarchicalFilter } from '../facet/filter/hierarchical-filter.model';
import { NumberRangeFilter } from '../facet/filter/number-range-filter.model';
import { SimpleFilter } from '../facet/filter/simple-filter.model';
import { IdentifiableSchema } from './identifiable.schema';

/**
 * Jest schema for validating Filter entities.
 *
 * @public
 */
export const FilterSchema: Filter = {
  ...IdentifiableSchema,
  facetId: expect.anyOf([Number, String]),
  label: expect.any(String),
  callbackInfo: expect.any(Object),
  modelName: expect.any(String)
};

/**
 * Jest schema for validating BooleanFilter entities.
 *
 * @public
 */
export const BooleanFilterSchema: BooleanFilter = {
  ...FilterSchema,
  modelName: expect.any(String),
  selected: expect.any(Boolean),
  value: expect.any(String)
};

/**
 * Jest schema for validating SimpleFilter entity.
 *
 * @public
 */
export const SimpleFilterSchema: SimpleFilter = {
  ...BooleanFilterSchema,
  modelName: 'SimpleFilter',
};

/**
 * Jest schema for validating HierarchicalFilter entity.
 *
 * @public
 */
export const HierarchicalFilterSchema: HierarchicalFilter = {
  ...BooleanFilterSchema,
  parentId: expect.nullOrAnyOf([Number, String]),
  children: expect.any(Array),
  modelName: 'HierarchicalFilter'
};

/**
 * Jest schema for validating NumberRangeFilter entity.
 *
 * @public
 */
export const NumberRangeFilterSchema: NumberRangeFilter = {
  ...BooleanFilterSchema,
  range: { min: expect.nullOr(Number), max: expect.nullOr(Number) },
  modelName: 'NumberRangeFilter'
};

/**
 * Jest schema for validating EditableNumberRangeFilterSchema entity.
 *
 * @public
 */
export const EditableNumberRangeFilterSchema: EditableNumberRangeFilter = {
  ...FilterSchema,
  range: { min: expect.nullOr(Number), max: expect.nullOr(Number) },
  modelName: 'EditableNumberRangeFilter'
};
