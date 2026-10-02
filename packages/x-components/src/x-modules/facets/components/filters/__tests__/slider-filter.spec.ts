import type { SliderFilter } from '@empathyco/x-types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createSliderFilter } from '../../../../../__stubs__/filters-stubs.factory'
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../../components/x-component.utils'
import { XPlugin } from '../../../../../plugins'
import SliderFilterComponent from '../slider-filter.vue'

function render({
  filter = createSliderFilter('price'),
  isInstant = false,
}: {
  filter?: SliderFilter
  isInstant?: boolean
} = {}) {
  const wrapper = mount(SliderFilterComponent, {
    props: { filter, isInstant },
    global: { plugins: [installNewXPlugin()] },
  })

  const minInputWrapper = wrapper.find(getDataTestSelector('slider-filter-input-min'))
  const maxInputWrapper = wrapper.find(getDataTestSelector('slider-filter-input-max'))
  const applyButtonWrapper = wrapper.find(getDataTestSelector('slider-filter-apply'))
  const clearButtonWrapper = wrapper.find(getDataTestSelector('slider-filter-clear'))

  return {
    wrapper,
    minInputWrapper,
    maxInputWrapper,
    applyButtonWrapper,
    clearButtonWrapper,
    typeMin: async (value: string) => {
      await minInputWrapper.setValue(value)
      await minInputWrapper.trigger('change')
    },
    typeMax: async (value: string) => {
      await maxInputWrapper.setValue(value)
      await maxInputWrapper.trigger('change')
    },
  }
}

describe('testing SliderFilter component', () => {
  it('should be an XComponent that belongs to the facets', () => {
    const { wrapper } = render()

    expect(isXComponent(wrapper.vm)).toBeTruthy()
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets')
  })

  it('should render the selected range values in the inputs', () => {
    const { minInputWrapper, maxInputWrapper } = render({
      filter: createSliderFilter('price', { min: 0, max: 100 }, { min: 10, max: 20 }),
    })

    expect((minInputWrapper.element as HTMLInputElement).value).toBe('10')
    expect((maxInputWrapper.element as HTMLInputElement).value).toBe('20')
  })

  it('should render the default aria-labels on the min and max inputs', () => {
    const { minInputWrapper, maxInputWrapper } = render()

    expect(minInputWrapper.attributes('aria-label')).toBe('minimum amount')
    expect(maxInputWrapper.attributes('aria-label')).toBe('maximum amount')
  })

  it('should allow overriding the aria-labels of the min and max inputs', async () => {
    const { wrapper, minInputWrapper, maxInputWrapper } = render()

    await wrapper.setProps({ minAriaLabel: 'Min price', maxAriaLabel: 'Max price' })
    await nextTick()

    expect(minInputWrapper.attributes('aria-label')).toBe('Min price')
    expect(maxInputWrapper.attributes('aria-label')).toBe('Max price')
  })

  it('should render the range limits when no range is selected', () => {
    const { minInputWrapper, maxInputWrapper } = render({
      filter: createSliderFilter('price', { min: 0, max: 100 }, { min: null, max: null }),
    })

    expect((minInputWrapper.element as HTMLInputElement).value).toBe('0')
    expect((maxInputWrapper.element as HTMLInputElement).value).toBe('100')
  })

  it('should render the apply button when isInstant is false', () => {
    const { applyButtonWrapper } = render({ isInstant: false })

    expect(applyButtonWrapper.exists()).toBeTruthy()
  })

  it('should not render the apply button when isInstant is true', () => {
    const { applyButtonWrapper } = render({ isInstant: true })

    expect(applyButtonWrapper.exists()).toBeFalsy()
  })

  it('should mark the filter as errored and disable the apply button when min is greater than max', async () => {
    const { wrapper, applyButtonWrapper } = render({
      filter: createSliderFilter('price', { min: 0, max: 100 }, { min: 20, max: 10 }),
    })

    expect(wrapper.classes()).toContain('x-slider-filter--error')
    expect((applyButtonWrapper.element as HTMLButtonElement).disabled).toBeTruthy()
  })

  describe('emitUserModifiedFilter', () => {
    it('should emit UserModifiedSliderFilter with the selected range when the values are valid and different', async () => {
      const { applyButtonWrapper, typeMin } = render({
        filter: createSliderFilter('price', { min: 0, max: 100 }, { min: 0, max: 100 }),
      })

      const listener = vi.fn()
      XPlugin.bus.on('UserModifiedSliderFilter').subscribe(listener)

      await typeMin('20')
      await applyButtonWrapper.trigger('click')

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          selectedRange: { min: 20, max: 100 },
        }),
      )
    })

    it('should not emit UserModifiedSliderFilter when the values are invalid', async () => {
      const { applyButtonWrapper, typeMin } = render({
        filter: createSliderFilter('price', { min: 0, max: 100 }, { min: 50, max: 60 }),
      })

      const listener = vi.fn()
      XPlugin.bus.on('UserModifiedSliderFilter').subscribe(listener)

      await typeMin('70')
      await applyButtonWrapper.trigger('click')

      expect(listener).not.toHaveBeenCalled()
    })

    it('should not emit UserModifiedSliderFilter when the values do not change the applied range', async () => {
      const { applyButtonWrapper } = render({
        filter: createSliderFilter('price', { min: 0, max: 100 }, { min: 10, max: 20 }),
      })

      const listener = vi.fn()
      XPlugin.bus.on('UserModifiedSliderFilter').subscribe(listener)

      await applyButtonWrapper.trigger('click')

      expect(listener).not.toHaveBeenCalled()
    })

    it('should not emit UserModifiedSliderFilter when the apply button is clicked without a selected range', async () => {
      const { applyButtonWrapper } = render({
        filter: createSliderFilter('price', { min: 0, max: 100 }, { min: null, max: null }),
      })

      const listener = vi.fn()
      XPlugin.bus.on('UserModifiedSliderFilter').subscribe(listener)

      await applyButtonWrapper.trigger('click')

      expect(listener).not.toHaveBeenCalled()
    })

    it('should not emit UserModifiedSliderFilter on input change when isInstant is false', async () => {
      const { typeMin } = render({
        filter: createSliderFilter('price', { min: 0, max: 100 }, { min: 0, max: 100 }),
      })

      const listener = vi.fn()
      XPlugin.bus.on('UserModifiedSliderFilter').subscribe(listener)

      await typeMin('20')

      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('instant mode', () => {
    it('should emit UserModifiedSliderFilter on input change when isInstant is true', async () => {
      const { typeMin, typeMax } = render({
        filter: createSliderFilter('price', { min: 0, max: 100 }, { min: 0, max: 100 }),
        isInstant: true,
      })

      const listener = vi.fn()
      XPlugin.bus.on('UserModifiedSliderFilter').subscribe(listener)

      await typeMin('20')

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          selectedRange: { min: 20, max: 100 },
        }),
      )

      await typeMax('40')

      expect(listener).toHaveBeenCalledTimes(2)
      expect(listener).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          selectedRange: { min: 20, max: 40 },
        }),
      )
    })

    it('should not emit UserModifiedSliderFilter on input change when the values are invalid', async () => {
      const { typeMin } = render({
        filter: createSliderFilter('price', { min: 0, max: 100 }, { min: 50, max: 60 }),
        isInstant: true,
      })

      const listener = vi.fn()
      XPlugin.bus.on('UserModifiedSliderFilter').subscribe(listener)

      await typeMin('70')

      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('clear values', () => {
    it('should reset the selected range to the range limits on clear button click', async () => {
      const { minInputWrapper, maxInputWrapper, clearButtonWrapper } = render({
        filter: createSliderFilter('price', { min: 0, max: 100 }, { min: 10, max: 20 }),
      })

      await clearButtonWrapper.trigger('click')

      expect((minInputWrapper.element as HTMLInputElement).value).toBe('0')
      expect((maxInputWrapper.element as HTMLInputElement).value).toBe('100')
    })

    it('should reset the selected range when UserClickedClearAllFilters is emitted', async () => {
      const { minInputWrapper, maxInputWrapper } = render({
        filter: createSliderFilter('price', { min: 0, max: 100 }, { min: 10, max: 20 }),
      })

      await XPlugin.bus.emit('UserClickedClearAllFilters', ['price'])
      await nextTick()

      expect((minInputWrapper.element as HTMLInputElement).value).toBe('0')
      expect((maxInputWrapper.element as HTMLInputElement).value).toBe('100')
    })

    it('should reset the selected range when UserClickedClearAllFilters is emitted without facets', async () => {
      const { minInputWrapper, maxInputWrapper } = render({
        filter: createSliderFilter('price', { min: 0, max: 100 }, { min: 10, max: 20 }),
      })

      await XPlugin.bus.emit('UserClickedClearAllFilters', undefined)
      await nextTick()

      expect((minInputWrapper.element as HTMLInputElement).value).toBe('0')
      expect((maxInputWrapper.element as HTMLInputElement).value).toBe('100')
    })

    it('should not reset the selected range when UserClickedClearAllFilters is emitted for other facets', async () => {
      const { minInputWrapper, maxInputWrapper } = render({
        filter: createSliderFilter('price', { min: 0, max: 100 }, { min: 10, max: 20 }),
      })

      await XPlugin.bus.emit('UserClickedClearAllFilters', ['weight'])
      await nextTick()

      expect((minInputWrapper.element as HTMLInputElement).value).toBe('10')
      expect((maxInputWrapper.element as HTMLInputElement).value).toBe('20')
    })
  })
})
