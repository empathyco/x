import { areFiltersDifferent } from '../utils';

describe('testing areFiltersDifferent util', () => {
  it('returns true with different filters', () => {
    /**
     * Unable to use Filter[] type due to circular reference between facets and their filters.
     */
    const newFiltersArray: any[] = [
      {
        // facet: {},
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"rompecabezas"',
        value: '{ "filter: "rompecabezas" }',
        count: 1,
        title: 'Rompecabezas',
        parent: null,
        callbackInfo: {},
        selected: false,
        children: []
      },
      {
        // facet: {},
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"puzzle"',
        value: '{ "filter: "puzzle" }',
        count: 1,
        title: 'Puzzle',
        parent: null,
        callbackInfo: {},
        selected: false,
        children: []
      }
    ];

    const oldFiltersArray: any[] = [
      {
        // facet: {},
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"lego"',
        value: '{ "filter: "lego" }',
        count: 1,
        title: 'Lego',
        parent: null,
        callbackInfo: {},
        selected: false,
        children: []
      },
      {
        // facet: {},
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"puzzle"',
        value: '{ "filter: "puzzle" }',
        count: 1,
        title: 'Puzzle',
        parent: null,
        callbackInfo: {},
        selected: false,
        children: []
      }
    ];

    expect(areFiltersDifferent(newFiltersArray, oldFiltersArray)).toBe(true);
  });

  it('returns false with the same filters', () => {
    /**
     * Unable to use Filter[] type due to circular reference between facets and their filters.
     */
    const newFiltersArray: any[] = [
      {
        // facet: {},
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"rompecabezas"',
        value: '{ "filter: "rompecabezas" }',
        count: 1,
        title: 'Rompecabezas',
        parent: null,
        callbackInfo: {},
        selected: false,
        children: []
      },
      {
        // facet: {},
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"puzzle"',
        value: '{ "filter: "puzzle" }',
        count: 1,
        title: 'Puzzle',
        parent: null,
        callbackInfo: {},
        selected: false,
        children: []
      }
    ];

    const oldFiltersArray: any[] = [
      {
        // facet: {},
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"rompecabezas"',
        value: '{ "filter: "rompecabezas" }',
        count: 1,
        title: 'Rompecabezas',
        parent: null,
        callbackInfo: {},
        selected: false,
        children: []
      },
      {
        // facet: {},
        modelName: 'SimpleFilter',
        id: 'hierarchical_category:"puzzle"',
        value: '{ "filter: "puzzle" }',
        count: 1,
        title: 'Puzzle',
        parent: null,
        callbackInfo: {},
        selected: false,
        children: []
      }
    ];

    expect(areFiltersDifferent(newFiltersArray, oldFiltersArray)).toBe(false);
  });
});
