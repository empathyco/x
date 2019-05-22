import { Facet } from '../../facet/facet.model';

export const FacetSchema: Facet = {
  title: expect.any(String),
  filters: expect.any(Array),
  preselected: expect.any(Boolean),
  modelName: expect.any(String)
};
