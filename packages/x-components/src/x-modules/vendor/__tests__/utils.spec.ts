import type { ListItem } from '../../../utils/types'
import { describe, expect, it } from 'vitest'
import { getIndexForRow, isFullWidthListItem } from '../utils'

const result = (id: string): ListItem => ({ id, modelName: 'Result' })
const results = (count: number, prefix = 'r'): ListItem[] =>
  Array.from({ length: count }, (_, index) => result(`${prefix}${index + 1}`))
const banner = (id = 'b'): ListItem => ({ id, modelName: 'Banner' })
const group = (id = 'g'): ListItem => ({ id, modelName: 'VendorRelatedPromptsGroup' })

describe('testing vendor utils', () => {
  describe('isFullWidthListItem', () => {
    it('returns true for the items rendered as a full row in the grid', () => {
      expect(isFullWidthListItem(banner())).toBe(true)
      expect(isFullWidthListItem({ id: 'nq', modelName: 'NextQueriesGroup' })).toBe(true)
      expect(isFullWidthListItem({ id: 'rp', modelName: 'RelatedPromptsGroup' })).toBe(true)
      expect(isFullWidthListItem({ id: 'vb', modelName: 'VendorBanner' })).toBe(true)
    })

    it('returns false for the items rendered in a single cell', () => {
      expect(isFullWidthListItem(result('1'))).toBe(false)
      expect(isFullWidthListItem({ id: 'vr', modelName: 'VendorResult' })).toBe(false)
      expect(
        isFullWidthListItem({ id: 'vb', modelName: 'VendorBanner', position: 2 } as ListItem),
      ).toBe(false)
    })
  })

  describe('getIndexForRow', () => {
    it('returns 0 for the first row', () => {
      expect(getIndexForRow(results(6), 1, 4)).toBe(0)
    })

    it('returns 0 for rows lower than 1', () => {
      expect(getIndexForRow(results(6), 0, 4)).toBe(0)
    })

    it('returns the index of the first item of the row', () => {
      expect(getIndexForRow(results(12), 2, 4)).toBe(4)
      expect(getIndexForRow(results(12), 3, 4)).toBe(8)
      expect(getIndexForRow(results(12), 3, 2)).toBe(4)
    })

    it('returns the end of the list when the row starts after an incomplete last row', () => {
      expect(getIndexForRow(results(6), 3, 4)).toBe(6)
    })

    it('returns the end of the list when the row starts just after the last item', () => {
      expect(getIndexForRow(results(8), 3, 4)).toBe(8)
    })

    it('returns -1 when the row is beyond the items', () => {
      expect(getIndexForRow(results(6), 4, 4)).toBe(-1)
      expect(getIndexForRow([], 2, 4)).toBe(-1)
    })

    it('counts the full-width items as a whole row', () => {
      const items = [banner(), ...results(5)]
      expect(getIndexForRow(items, 2, 4)).toBe(1)
      expect(getIndexForRow(items, 3, 4)).toBe(5)
    })

    it('closes an incomplete row before a full-width item', () => {
      const items = [...results(2), banner(), ...results(4, 's')]
      expect(getIndexForRow(items, 2, 4)).toBe(2)
      expect(getIndexForRow(items, 3, 4)).toBe(3)
    })

    it('does not count the vendor related prompts groups and keeps their order', () => {
      const items = [...results(4), group('g1'), ...results(4, 's')]
      expect(getIndexForRow(items, 2, 4)).toBe(5)
      expect(getIndexForRow(items, 3, 4)).toBe(9)
    })
  })
})
