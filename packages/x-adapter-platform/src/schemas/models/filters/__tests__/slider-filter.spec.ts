import type { SliderFilter } from '@empathyco/x-types'
import type { PlatformSliderFilter } from '../../../../types'
import { schemaMapperFactory } from '@empathyco/x-adapter'
import { describe, expect, it } from 'vitest'
import { sliderFilterSchema } from '../slider-filter.schema'

const createSliderFilter = (
  min = '0',
  max = '100',
  unit: SliderFilter['unit'] = 'currency',
): PlatformSliderFilter => ({
  min,
  max,
  unit,
})

describe('tests', () => {
  const mapper = schemaMapperFactory<PlatformSliderFilter, SliderFilter>(sliderFilterSchema)

  it('should map the range values to numbers', () => {
    const filter = mapper(createSliderFilter('10', '20'), { facetId: 'price' })
    expect(filter.range).toEqual({ min: 10, max: 20 })
  })

  it('should map the facet id, the model name and the selected value', () => {
    const filter = mapper(createSliderFilter(), { facetId: 'price' })
    expect(filter.facetId).toBe('price')
    expect(filter.modelName).toBe('SliderFilter')
    expect(filter.selected).toBeFalsy()
  })

  it('should map the unit', () => {
    expect(mapper(createSliderFilter(), { facetId: 'price' }).unit).toBe('currency')
    expect(mapper(createSliderFilter('0', '100', 'percent'), { facetId: 'price' }).unit).toBe(
      'percent',
    )
  })

  describe('id', () => {
    it('should use the matching filter parameter when present', () => {
      const filter = mapper(createSliderFilter(), {
        facetId: 'price',
        requestParameters: { filter: ['color:red', 'price:10-20'] },
      })
      expect(filter.id).toBe('price:10-20')
    })

    it('should fallback to the facet id and range values when no filter parameter matches', () => {
      const filter = mapper(createSliderFilter('5', '15'), {
        facetId: 'price',
        requestParameters: { filter: ['color:red'] },
      })
      expect(filter.id).toBe('price:5:15')
    })

    it('should not match filter parameters of other facets', () => {
      const filter = mapper(createSliderFilter('5', '15'), {
        facetId: 'price2',
        requestParameters: { filter: ['price:10-20'] },
      })
      expect(filter.id).toBe('price2:5:15')
    })

    it('should fallback to the facet id and range values when there is no context', () => {
      const filter = mapper(createSliderFilter('5', '15'), {})
      expect(filter.id).toBe('undefined:5:15')
    })
  })

  describe('selectedRange', () => {
    it('should map null values when there is no matching filter parameter', () => {
      const filter = mapper(createSliderFilter(), {
        facetId: 'price',
        requestParameters: { filter: ['color:red'] },
      })
      expect(filter.selectedRange).toEqual({ min: null, max: null })
    })

    it('should map the selected range from the matching filter parameter', () => {
      const filter = mapper(createSliderFilter(), {
        facetId: 'price',
        requestParameters: { filter: ['price:10-20'] },
      })
      expect(filter.selectedRange).toEqual({ min: 10, max: 20 })
    })

    it('should map null values when there is no context', () => {
      const filter = mapper(createSliderFilter(), {})
      expect(filter.selectedRange).toEqual({ min: null, max: null })
    })
  })
})
