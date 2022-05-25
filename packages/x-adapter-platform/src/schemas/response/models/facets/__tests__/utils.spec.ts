import { getFacetConfig, getFacetId } from '../utils';
import { facetsConfig } from '../../facet.schema';

describe('getFacetConfig', () => {
  it('returns the config when the facet has its own config', () => {
    expect(getFacetConfig('categoryPaths')).toStrictEqual(facetsConfig.categoryPaths);
    expect(getFacetConfig('categoryPaths_78d9b7366')).toStrictEqual(facetsConfig.categoryPaths);
  });
  it("returns the default config when the facet doesn't have its own config", () => {
    expect(getFacetConfig('gender')).toStrictEqual(facetsConfig.default);
  });
});

describe('getFacetId', () => {
  it('returns the facet id', () => {
    expect(getFacetId('categoryPaths')).toEqual('categoryPaths');
    expect(getFacetId('categoryPaths_78d9b7366')).toEqual('categoryPaths');
  });
});
