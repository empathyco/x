import { hierarchicalFilterSchema } from '../../models/filters/hierarchical-filter.schema';
import { numberFilterSchema } from '../../models/filters/number-filter.schema';
import { simpleFilterSchema } from '../../models/filters/simple-filter.schema';
import { getFacetConfig } from '../utils';

describe('getFacetConfig', () => {
  it('returns the "simple" config when the type is `value`', () => {
    expect(getFacetConfig('value')).toStrictEqual({
      modelName: 'SimpleFacet',
      schema: simpleFilterSchema
    });
  });
  it('returns the "hierarchical" config when the type is `hierarchical`', () => {
    expect(getFacetConfig('hierarchical')).toStrictEqual({
      modelName: 'HierarchicalFacet',
      schema: hierarchicalFilterSchema
    });
  });
  it('returns the "number" config when the type is `range`', () => {
    expect(getFacetConfig('range')).toStrictEqual({
      modelName: 'NumberRangeFacet',
      schema: numberFilterSchema
    });
  });
});
