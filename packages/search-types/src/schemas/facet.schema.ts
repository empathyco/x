import { Facet } from '../facet/facet.model';

/**
 * @public
 * Jest schema for validating Facet entities
 */
export const FacetSchema: Facet = {
  title: expect.any(String),
  filters: expect.any(Array),
  modelName: expect.any(String)
};
