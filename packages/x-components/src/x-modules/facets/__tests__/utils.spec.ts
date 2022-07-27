import { createHierarchicalFacetStub } from '../../../__stubs__';
import { flatHierarchicalFilters, isNewQuery } from '../utils';

describe('testing hasQueryChanged util', () => {
  it('returns true when the new query changes by one word', () => {
    const newQuery = 'pantalon verde';
    const previousQuery = 'pantalon rojo';
    expect(isNewQuery(newQuery, previousQuery)).toBe(true);
  });
  it('returns true when the new query changes by one word in a different position', () => {
    const newQuery = 'calcetin verde';
    const previousQuery = 'pantalon rojo';
    expect(isNewQuery(newQuery, previousQuery)).toBe(true);
  });
  it('returns true when the query changes by one word in the middle of the query', () => {
    const newQuery = 'pantalones largos de pana azules';
    const previousQuery = 'pantalones cortos de pana azules';
    expect(isNewQuery(newQuery, previousQuery)).toBe(true);
  });
  it('returns true when the new query is empty but the previous is not', () => {
    const newQuery = '';
    const previousQuery = 'trousers';
    expect(isNewQuery(newQuery, previousQuery)).toBe(true);
  });
  it('returns true when the previous query is empty but the new is not', () => {
    const newQuery = 'trousers';
    const previousQuery = '';
    expect(isNewQuery(newQuery, previousQuery)).toBe(true);
  });
  it('returns false when the new query has only one different word', () => {
    const newQuery = 'pantalon corto rojo';
    const previousQuery = 'pantalon corto';
    expect(isNewQuery(newQuery, previousQuery)).toBe(false);
  });
  it('returns false when the new query has only one different word in a different position', () => {
    const newQuery = 'pantalon rojo corto';
    const previousQuery = 'pantalon corto';
    expect(isNewQuery(newQuery, previousQuery)).toBe(false);
  });
  it('returns false when the new query has the same words but with less letters', () => {
    const newQuery = 'pantalon corto';
    const previousQuery = 'pantalones cortos';
    expect(isNewQuery(newQuery, previousQuery)).toBe(false);
  });
});

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

  it('returns an array with all filters flattened', () => {
    const flattenedHierarchicalFilters = flatHierarchicalFilters(hierarchicalFilters);

    expect(flattenedHierarchicalFilters).toHaveLength(6);
  });

  it('keeps the parent-children relations in the flattened filters', () => {
    flatHierarchicalFilters(hierarchicalFilters);

    expect(hierarchicalFilters).toHaveLength(3);
    expect(hierarchicalFilters[0].children).toHaveLength(1);
    expect(hierarchicalFilters[1].children).toHaveLength(1);
    expect(hierarchicalFilters[2].children).toHaveLength(1);
  });

  it('does not duplicate the flattened filters', () => {
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
});
