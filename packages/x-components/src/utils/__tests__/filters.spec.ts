import {
  createEditableNumberRangeFilter,
  createHierarchicalFilter,
  createNumberRangeFilter,
  createRawFilter,
  createSimpleFilter
} from '../../__stubs__/filters-stubs.factory';
import { areFiltersDifferent } from '../filters';

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
