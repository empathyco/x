import {
  createHierarchicalFacetStub,
  createNumberRangeFacet,
  createSimpleFacetStub
} from '../../__stubs__/facets-stubs.factory';
import {
  createEditableNumberRangeFilter,
  createHierarchicalFilter,
  createNextEditableNumberRangeFilter,
  createNextHierarchicalFilter,
  createNextNumberRangeFilter,
  createNextSimpleFilter,
  createNumberRangeFilter,
  createRawFilter,
  createSimpleFilter,
  getHierarchicalFilterStub
} from '../../__stubs__/filters-stubs.factory';
import {
  areNextFiltersDifferent,
  extractFilters,
  isFilterPartiallySelected,
  isFilterSelected
} from '../filters';

describe(`testing ${areNextFiltersDifferent.name}`, () => {
  it('returns true with different filters', () => {
    expect(areNextFiltersDifferent([createNextSimpleFilter('color', 'red')], [])).toBe(true);
    expect(areNextFiltersDifferent([], [createNextSimpleFilter('color', 'red')])).toBe(true);
    expect(
      areNextFiltersDifferent(
        [createNextSimpleFilter('color', 'red')],
        [createNextSimpleFilter('color', 'blue')]
      )
    ).toBe(true);
    expect(
      areNextFiltersDifferent(
        [createNextHierarchicalFilter('category', 'shirt')],
        [createNextHierarchicalFilter('category', 'jeans')]
      )
    ).toBe(true);
    expect(
      areNextFiltersDifferent(
        [createNextNumberRangeFilter('price', { min: null, max: 10 })],
        [createNextNumberRangeFilter('price', { min: null, max: 50 })]
      )
    ).toBe(true);
    expect(
      areNextFiltersDifferent(
        [createNextEditableNumberRangeFilter('age', { min: null, max: 10 })],
        [createNextEditableNumberRangeFilter('age', { min: null, max: 50 })]
      )
    ).toBe(true);
    expect(areNextFiltersDifferent([createRawFilter('size:m')], [createRawFilter('size:l')])).toBe(
      true
    );
  });

  it('returns false with the same filters', () => {
    expect(
      areNextFiltersDifferent(
        [createNextSimpleFilter('color', 'red', false)],
        [createNextSimpleFilter('color', 'red', true)]
      )
    ).toBe(false);
    expect(
      areNextFiltersDifferent(
        [createNextHierarchicalFilter('category', 'shirt')],
        [createNextHierarchicalFilter('category', 'shirt')]
      )
    ).toBe(false);
    expect(
      areNextFiltersDifferent(
        [createNextNumberRangeFilter('price', { min: null, max: 10 })],
        [createNextNumberRangeFilter('price', { min: null, max: 10 })]
      )
    ).toBe(false);
    expect(
      areNextFiltersDifferent(
        [createNextEditableNumberRangeFilter('age', { min: null, max: 30 })],
        [createNextEditableNumberRangeFilter('age', { min: null, max: 30 })]
      )
    ).toBe(false);
    expect(areNextFiltersDifferent([createRawFilter('size:l')], [createRawFilter('size:l')])).toBe(
      false
    );
    expect(
      areNextFiltersDifferent(
        [
          createNextSimpleFilter('color', 'red', false),
          createNextHierarchicalFilter('category', 'shirt'),
          createNextNumberRangeFilter('price', { min: null, max: 10 }),
          createNextEditableNumberRangeFilter('age', { min: null, max: 30 }),
          createRawFilter('size:l')
        ],
        [
          createRawFilter('size:l'),
          createNextEditableNumberRangeFilter('age', { min: null, max: 30 }),
          createNextNumberRangeFilter('price', { min: null, max: 10 }),
          createNextHierarchicalFilter('category', 'shirt'),
          createNextSimpleFilter('color', 'red', false)
        ]
      )
    ).toBe(false);
  });
});

describe(`testing ${isFilterPartiallySelected.name}`, () => {
  it('returns `false` when the root filter is selected and has no children selected', () => {
    const filter = getHierarchicalFilterStub({
      selected: true,
      children: [
        getHierarchicalFilterStub({
          children: [getHierarchicalFilterStub()]
        }),
        getHierarchicalFilterStub()
      ]
    });

    expect(isFilterPartiallySelected(filter)).toEqual(false);
  });

  it('returns `false` when the root filter is selected and every child is selected', () => {
    const filter = getHierarchicalFilterStub({
      selected: true,
      children: [
        getHierarchicalFilterStub({
          selected: true,
          children: [
            getHierarchicalFilterStub({
              selected: true
            })
          ]
        }),
        getHierarchicalFilterStub({
          selected: true
        })
      ]
    });

    expect(isFilterPartiallySelected(filter)).toEqual(false);
  });

  // eslint-disable-next-line max-len
  it('returns `true` when the root filter is selected and not all the child filters at a same level are selected', () => {
    const filter = getHierarchicalFilterStub({
      selected: true,
      children: [
        getHierarchicalFilterStub({
          selected: true,
          children: [
            getHierarchicalFilterStub({
              selected: true
            }),
            getHierarchicalFilterStub({
              selected: false
            })
          ]
        }),
        getHierarchicalFilterStub({
          selected: true
        })
      ]
    });

    expect(isFilterPartiallySelected(filter)).toEqual(true);
  });

  // eslint-disable-next-line max-len
  it('returns `true` when the root filter is NOT selected and not all the child filters at a same level are selected', () => {
    const filter = getHierarchicalFilterStub({
      selected: false,
      children: [
        getHierarchicalFilterStub({
          selected: true,
          children: [
            getHierarchicalFilterStub({
              selected: true
            }),
            getHierarchicalFilterStub({
              selected: false
            })
          ]
        }),
        getHierarchicalFilterStub({
          selected: true
        })
      ]
    });

    expect(isFilterPartiallySelected(filter)).toEqual(true);
  });
});

describe(`testing ${isFilterSelected.name}`, () => {
  it('returns true for boolean filters with their selected property set to true', () => {
    expect(isFilterSelected(createSimpleFilter('brand', 'Vans', true))).toBe(true);
    expect(isFilterSelected(createSimpleFilter('brand', 'Levis', false))).toBe(false);
    expect(isFilterSelected(createHierarchicalFilter('category', 'Men', true))).toBe(true);
    expect(isFilterSelected(createHierarchicalFilter('category', 'Women', false))).toBe(false);
    expect(isFilterSelected(createNumberRangeFilter('category', { min: 0, max: 10 }, true))).toBe(
      true
    );
    expect(isFilterSelected(createNumberRangeFilter('category', { min: 10, max: 20 }, false))).toBe(
      false
    );
  });
  it('returns true for editable number range filters with a non null range', () => {
    expect(
      isFilterSelected(createEditableNumberRangeFilter('price', '*', { min: null, max: null }))
    ).toBe(false);
    expect(
      isFilterSelected(createEditableNumberRangeFilter('price', 'From 0', { min: 0, max: null }))
    ).toBe(true);
    expect(
      isFilterSelected(createEditableNumberRangeFilter('price', 'Up to 0', { min: null, max: 0 }))
    ).toBe(true);
    expect(
      isFilterSelected(
        createEditableNumberRangeFilter('price', 'From -10 to 10', { min: -10, max: 10 })
      )
    ).toBe(true);
  });
});

describe(`testing ${extractFilters.name}`, () => {
  const brand = createSimpleFacetStub('brand', createFilter => [
    createFilter('Vans', false),
    createFilter('Levis', true)
  ]);
  const category = createHierarchicalFacetStub('category', createFilter => [
    createFilter('Men', false, createFilter => [createFilter('Shirt', false)]),
    createFilter('Women', true, createFilter => [createFilter('Skirt', true)])
  ]);
  const price = createNumberRangeFacet('price', createFilter => [
    createFilter({ min: 0, max: 10 }, false),
    createFilter({ min: 10, max: null }, true)
  ]);

  it('extracts filters from a record of facets', () => {
    const filters = extractFilters({
      brand,
      category,
      price
    });

    expect(filters).toHaveLength(8);
    expect(filters).toEqual(
      expect.arrayContaining([
        ...brand.filters,
        ...category.filters,
        ...category.filters[0].children!,
        ...category.filters[1].children!,
        ...price.filters
      ])
    );
  });

  it('extracts filters from an array of facets', () => {
    const filters = extractFilters([brand, category, price]);
    expect(filters).toHaveLength(8);
    expect(filters).toEqual(
      expect.arrayContaining([
        ...brand.filters,
        ...category.filters,
        ...category.filters[0].children!,
        ...category.filters[1].children!,
        ...price.filters
      ])
    );
  });
});
