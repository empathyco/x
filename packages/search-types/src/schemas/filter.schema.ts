import { EditableNumberRangeFilter, FacetFilter } from '../facet/filter';
import { BooleanFilter } from '../facet/filter/boolean-filter.model';
import { Filter } from '../facet/filter/filter.model';
import { HierarchicalFilter } from '../facet/filter/hierarchical-filter.model';
import { NumberRangeFilter } from '../facet/filter/number-range-filter.model';
import { RawFilter } from '../facet/filter/raw-filter.model';
import { SimpleFilter } from '../facet/filter/simple-filter.model';
import { IdentifiableSchema } from './identifiable.schema';

/**
 * Jest schema for validating Filter entities.
 *
 * @public
 */
export const FilterSchema: Filter = {
  ...IdentifiableSchema,
  modelName: expect.any(String),
  selected: expect.any(Boolean),
};

/**
 * Jest schema for validating {@link FacetFilter} entities.
 *
 * @public
 */
export const FacetFilterSchema: FacetFilter = {
  ...FilterSchema,
  facetId: expect.anyOf([Number, String]),
  modelName: expect.any(String) && expect.not.stringMatching('RawFilter')
};

/**
 * Jest schema for validating RawFilter entities.
 *
 * @public
 */
export const RawFilterSchema: RawFilter = {
  ...FilterSchema,
  modelName: 'RawFilter',
  id: expect.any(String),
  selected: true
};

/**
 * Jest schema for validating BooleanFilter entities.
 *
 * @public
 */
export const BooleanFilterSchema: BooleanFilter = {
  ...FacetFilterSchema,
  label: expect.any(String),
  value: expect.any(String),
  totalResults: expect.undefinedOr(Number)
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
  children: expect.undefinedOr(Array),
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
