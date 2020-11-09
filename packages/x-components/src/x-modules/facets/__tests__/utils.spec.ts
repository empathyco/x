import { Filter } from '@empathy/search-types';
import { areFiltersDifferent } from '../utils';

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
