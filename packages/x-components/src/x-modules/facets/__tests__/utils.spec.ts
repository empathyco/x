import { Filter } from '@empathy/search-types';
import { areFiltersDifferent, isNewQuery } from '../utils';

describe('testing areFiltersDifferent util', () => {
  it('returns true with different filters', () => {
    const newFiltersArray: Filter[] = [
      {
        facetId: 'hierarchical_category',
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"rompecabezas"',
        value: '{ "filter: "rompecabezas" }',
        totalResults: 1,
        label: 'Rompecabezas',
        callbackInfo: {},
        selected: false
      },
      {
        facetId: 'hierarchical_category',
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"puzzle"',
        value: '{ "filter: "puzzle" }',
        totalResults: 1,
        label: 'Puzzle',
        callbackInfo: {},
        selected: false
      }
    ];

    const oldFiltersArray: Filter[] = [
      {
        facetId: 'hierarchical_category',
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"lego"',
        value: '{ "filter: "lego" }',
        totalResults: 1,
        label: 'Lego',
        callbackInfo: {},
        selected: false
      },
      {
        facetId: 'hierarchical_category',
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"puzzle"',
        value: '{ "filter: "puzzle" }',
        totalResults: 1,
        label: 'Puzzle',
        callbackInfo: {},
        selected: false
      }
    ];

    expect(areFiltersDifferent(newFiltersArray, oldFiltersArray)).toBe(true);
  });

  it('returns false with the same filters', () => {
    const newFiltersArray: Filter[] = [
      {
        facetId: 'hierarchical_category',
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"rompecabezas"',
        value: '{ "filter: "rompecabezas" }',
        totalResults: 1,
        label: 'Rompecabezas',
        callbackInfo: {},
        selected: false
      },
      {
        facetId: 'hierarchical_category',
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"puzzle"',
        value: '{ "filter: "puzzle" }',
        totalResults: 1,
        label: 'Puzzle',
        callbackInfo: {},
        selected: false
      }
    ];

    const oldFiltersArray: Filter[] = [
      {
        facetId: 'hierarchical_category',
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"rompecabezas"',
        value: '{ "filter: "rompecabezas" }',
        totalResults: 1,
        label: 'Rompecabezas',
        callbackInfo: {},
        selected: false
      },
      {
        facetId: 'hierarchical_category',
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"puzzle"',
        value: '{ "filter: "puzzle" }',
        totalResults: 1,
        label: 'Puzzle',
        callbackInfo: {},
        selected: false
      }
    ];

    expect(areFiltersDifferent(newFiltersArray, oldFiltersArray)).toBe(false);
  });
});

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
