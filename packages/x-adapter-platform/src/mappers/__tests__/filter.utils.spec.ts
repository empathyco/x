import { filtersStub, mappedFiltersStub } from '../../__tests__/__fixtures__/filter'
import { mapFilters } from '../filter.utils'

describe('filter utils methods tests', () => {
  describe('mapFilters', () => {
    it('should return an empty array when no filters are provided', () => {
      expect(mapFilters({})).toEqual([])
    })

    it('should map filters correctly', () => {
      expect(mapFilters(filtersStub)).toStrictEqual(mappedFiltersStub)
    })
  })
})
