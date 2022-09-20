import { createHierarchicalFacetStub } from '../../../__stubs__';
import { flatHierarchicalFilters } from '../utils';

describe('testing flatHierarchicalFilters util', () => {
  const hierarchicalFilters = createHierarchicalFacetStub('hierarchical_category', createFilter => [
    createFilter('Vehículos y pistas', false, createFilter => [
      createFilter('Radiocontrol', false)
    ]),
    createFilter('Juguetes electrónicos', false, createFilter => [
      createFilter('Imagen y audio', false)
    ]),
    createFilter('Educativos', false, createFilter => [createFilter('Juguetes educativos', false)])
  ]).filters;

  // eslint-disable-next-line max-len
  it('returns an array with all filters flattened and does not duplicate the flattened filters', () => {
    const allFilters = [
      ...hierarchicalFilters,
      ...hierarchicalFilters[0].children!,
      ...hierarchicalFilters[2].children!,
      ...hierarchicalFilters[2].children!
    ];
    const flattenedHierarchicalFilters = flatHierarchicalFilters(hierarchicalFilters);

    expect(allFilters).toHaveLength(6);
    expect(flattenedHierarchicalFilters).toHaveLength(6);
    allFilters.forEach(filter => {
      expect(flattenedHierarchicalFilters).toContain(filter);
    });
  });

  it('keeps the parent-children relations in the flattened filters', () => {
    flatHierarchicalFilters(hierarchicalFilters);

    expect(hierarchicalFilters).toHaveLength(3);
    expect(hierarchicalFilters[0].children).toHaveLength(1);
    expect(hierarchicalFilters[1].children).toHaveLength(1);
    expect(hierarchicalFilters[2].children).toHaveLength(1);
  });
});
