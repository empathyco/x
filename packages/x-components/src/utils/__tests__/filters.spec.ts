import { Filter } from '@empathyco/x-types';
import {
  createEditableNumberRangeFilter,
  createHierarchicalFilter,
  createNumberRangeFilter,
  createRawFilter,
  createSimpleFilter
} from '../../__stubs__/filters-stubs.factory';
import { areFiltersDifferent, createRawFilters } from '../filters';

describe(`testing ${areFiltersDifferent.name}`, () => {
  it('returns true with different filters', () => {
    expect(areFiltersDifferent([createSimpleFilter('color', 'red')], [])).toBe(true);
    expect(areFiltersDifferent([], [createSimpleFilter('color', 'red')])).toBe(true);
    expect(
      areFiltersDifferent(
        [createSimpleFilter('color', 'red')],
        [createSimpleFilter('color', 'blue')]
      )
    ).toBe(true);
    expect(
      areFiltersDifferent(
        [createHierarchicalFilter('category', 'shirt')],
        [createHierarchicalFilter('category', 'jeans')]
      )
    ).toBe(true);
    expect(
      areFiltersDifferent(
        [createNumberRangeFilter('price', { min: null, max: 10 })],
        [createNumberRangeFilter('price', { min: null, max: 50 })]
      )
    ).toBe(true);
    expect(
      areFiltersDifferent(
        [createEditableNumberRangeFilter('age', { min: null, max: 10 })],
        [createEditableNumberRangeFilter('age', { min: null, max: 50 })]
      )
    ).toBe(true);
    expect(areFiltersDifferent([createRawFilter('size:m')], [createRawFilter('size:l')])).toBe(
      true
    );
  });

  it('returns false with the same filters', () => {
    expect(
      areFiltersDifferent(
        [createSimpleFilter('color', 'red', false)],
        [createSimpleFilter('color', 'red', true)]
      )
    ).toBe(false);
    expect(
      areFiltersDifferent(
        [createHierarchicalFilter('category', 'shirt')],
        [createHierarchicalFilter('category', 'shirt')]
      )
    ).toBe(false);
    expect(
      areFiltersDifferent(
        [createNumberRangeFilter('price', { min: null, max: 10 })],
        [createNumberRangeFilter('price', { min: null, max: 10 })]
      )
    ).toBe(false);
    expect(
      areFiltersDifferent(
        [createEditableNumberRangeFilter('age', { min: null, max: 30 })],
        [createEditableNumberRangeFilter('age', { min: null, max: 30 })]
      )
    ).toBe(false);
    expect(areFiltersDifferent([createRawFilter('size:l')], [createRawFilter('size:l')])).toBe(
      false
    );
    expect(
      areFiltersDifferent(
        [
          createSimpleFilter('color', 'red', false),
          createHierarchicalFilter('category', 'shirt'),
          createNumberRangeFilter('price', { min: null, max: 10 }),
          createEditableNumberRangeFilter('age', { min: null, max: 30 }),
          createRawFilter('size:l')
        ],
        [
          createRawFilter('size:l'),
          createEditableNumberRangeFilter('age', { min: null, max: 30 }),
          createNumberRangeFilter('price', { min: null, max: 10 }),
          createHierarchicalFilter('category', 'shirt'),
          createSimpleFilter('color', 'red', false)
        ]
      )
    ).toBe(false);
  });
});

describe(`testing ${createRawFilters.name}`, () => {
  it('returns a list of raw filters based on a list of filter ids', () => {
    const filterIds = [
      '{!tag=hierarchical_category}hierarchical_category:"catálogos"',
      241008287272164729465721528295504357972
    ];
    const rawFilters = createRawFilters(filterIds);

    expect(rawFilters).toEqual<Filter[]>([
      {
        id: '{!tag=hierarchical_category}hierarchical_category:"catálogos"',
        modelName: 'RawFilter',
        selected: true
      },
      {
        id: 241008287272164729465721528295504357972,
        modelName: 'RawFilter',
        selected: true
      }
    ]);
  });
});
