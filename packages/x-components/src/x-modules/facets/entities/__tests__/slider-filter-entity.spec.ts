import type { SliderFilter } from '@empathyco/x-types'
import { describe, expect, it } from 'vitest'
import { createSliderFilter } from '../../../../__stubs__/filters-stubs.factory'
import { SliderFilterEntity } from '../slider-filter.entity'
import { getStoreFiltersByFacetId, prepareFacetsStore } from './utils'

const getStoreSliderFilter = (store: ReturnType<typeof prepareFacetsStore>, facetId: string) =>
  getStoreFiltersByFacetId<SliderFilter>(store, facetId)[0]

describe('testing SliderFilterEntity', () => {
  it('should select a filter and store it selected when the selected range differs from the range', () => {
    const store = prepareFacetsStore()
    const filter = createSliderFilter('price', { min: 0, max: 100 }, { min: 10, max: 20 })
    const filterEntity = new SliderFilterEntity(store)

    filterEntity.select(filter)

    const storedFilter = getStoreSliderFilter(store, 'price')
    expect(storedFilter.id).toBe('price:10-20')
    expect(storedFilter.selected).toBeTruthy()
    expect(storedFilter.selectedRange).toEqual({ min: 10, max: 20 })
    expect(storedFilter.range).toEqual({ min: 0, max: 100 })
  })

  it('should not store the filter as selected when the selected range matches the range limits', () => {
    const store = prepareFacetsStore()
    const filter = createSliderFilter('price', { min: 0, max: 100 }, { min: null, max: null })
    const filterEntity = new SliderFilterEntity(store)

    filterEntity.select(filter)

    const storedFilter = getStoreSliderFilter(store, 'price')
    expect(storedFilter.id).toBe('price:0-100')
    expect(storedFilter.selected).toBeFalsy()
  })

  it('should replace the previous filter of the facet when selecting a filter with other values', () => {
    const store = prepareFacetsStore()
    const filterEntity = new SliderFilterEntity(store)
    const previousFilter = createSliderFilter('price', { min: 0, max: 100 }, { min: 10, max: 20 })
    const filter = createSliderFilter('price', { min: 0, max: 100 }, { min: 15, max: 25 })

    filterEntity.select(previousFilter)
    filterEntity.select(filter)

    expect(getStoreFiltersByFacetId(store, 'price')).toHaveLength(1)
    expect(getStoreSliderFilter(store, 'price').id).toBe('price:15-25')
    expect(store.state.x.facets.filters[previousFilter.id]).toBeUndefined()
  })

  it('should deselect a selected filter and reset its selected range', () => {
    const store = prepareFacetsStore()
    const filter = createSliderFilter('price', { min: 0, max: 100 }, { min: 10, max: 20 })
    const filterEntity = new SliderFilterEntity(store)

    filterEntity.deselect(filter)

    const storedFilter = getStoreSliderFilter(store, 'price')
    expect(storedFilter.id).toBe('price:0-100')
    expect(storedFilter.selected).toBeFalsy()
    expect(storedFilter.selectedRange).toEqual({ min: null, max: null })
    expect(storedFilter.range).toEqual({ min: 0, max: 100 })
  })

  it('should remove the filter of the facet when deselecting', () => {
    const store = prepareFacetsStore()
    const filterEntity = new SliderFilterEntity(store)
    const filter = createSliderFilter('price', { min: 0, max: 100 }, { min: 10, max: 20 })

    filterEntity.select(filter)
    const filterId = filter.id
    filterEntity.deselect(filter)

    expect(getStoreFiltersByFacetId(store, 'price')).toHaveLength(1)
    expect(getStoreSliderFilter(store, 'price').id).toBe('price:0-100')
    expect(store.state.x.facets.filters[filterId]).toBeUndefined()
  })
})
