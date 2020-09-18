import { Facet } from '../facet/facet.model';

/**
 * Jest schema for validating Facet entities.
 *
 * @public
 */
export const FacetSchema: Facet = {
  title: expect.any(String),
  filters: expect.any(Array),
  modelName: expect.any(String)
};
