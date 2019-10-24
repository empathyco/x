import { Facet } from '../../facet/facet.model';

export const FacetSchema: Facet = {
  title: expect.any(String),
  filters: expect.any(Array),
  modelName: expect.any(String)
};
