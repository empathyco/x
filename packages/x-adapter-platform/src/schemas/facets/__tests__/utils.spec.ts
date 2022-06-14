import { getFacetConfig } from '../utils';
import { facetsConfig } from '../../models/facet.schema';

describe('getFacetConfig', () => {
  it('returns the config when the facet has its own config', () => {
    expect(getFacetConfig('categoryPaths')).toStrictEqual(facetsConfig.categoryPaths);
  });
  it("returns the default config when the facet doesn't have its own config", () => {
    expect(getFacetConfig('gender')).toStrictEqual(facetsConfig.default);
  });
});
