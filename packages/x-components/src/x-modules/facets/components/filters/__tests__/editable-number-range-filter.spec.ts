import type { EditableNumberRangeFilter, RangeValue } from '@empathyco/x-types'
import type { SnippetConfig } from '../../../../../x-installer/api/api.types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { createEditableNumberRangeFilter } from '../../../../../__stubs__/filters-stubs.factory'
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils'
import BaseSlider from '../../../../../components/base-slider.vue'
import { getXComponentXModuleName, isXComponent } from '../../../../../components/x-component.utils'
import { XPlugin } from '../../../../../plugins'
import EditableNumberRangeFilterComponent from '../editable-number-range-filter.vue'

function renderEditableNumberRangeFilter({
  template = `
    <EditableNumberRangeFilterComponent :filter="filter" :isInstant="isInstant" />
  `,
  range = { min: null, max: null } as RangeValue,
  isInstant = false,
  unit = 'decimal',
  snippetConfig = { uiLang: 'en-US' },
}: {
  template?: string
  range?: RangeValue
  isInstant?: boolean
  unit?: EditableNumberRangeFilter['unit']
  snippetConfig?: Partial<SnippetConfig>
} = {}) {
  const filter = ref({ ...createEditableNumberRangeFilter('age', range), unit })

  const wrapper = mount(
    {
      components: { EditableNumberRangeFilterComponent },
      template,
    },
    {
      data: () => ({
        filter,
        isInstant,
      }),
      global: {
        plugins: [installNewXPlugin()],
        provide: { snippetConfig },
      },
    },
  )

  const filterWrapper = wrapper.findComponent(EditableNumberRangeFilterComponent)
  const minInputWrapper = filterWrapper.find(getDataTestSelector('range-min'))
  const maxInputWrapper = filterWrapper.find(getDataTestSelector('range-max'))
  const applyButtonWrapper = filterWrapper.find(getDataTestSelector('range-apply'))
  const clearButtonWrapper = filterWrapper.find(getDataTestSelector('range-clear'))

  return {
    filterWrapper,
    minInputWrapper,
    maxInputWrapper,
    applyButtonWrapper,
    clearButtonWrapper,
    filter,
    typeMin: async (value: any) => {
      await minInputWrapper.setValue(value)
      await minInputWrapper.trigger('change')
    },
    typeMax: async (value: any) => {
      await maxInputWrapper.setValue(value)
      await maxInputWrapper.trigger('change')
    },
  }
}

describe('testing BaseNumberRangeFilter component', () => {
  it('is an x-component', () => {
    const { filterWrapper } = renderEditableNumberRangeFilter()
    expect(isXComponent(filterWrapper.vm)).toEqual(true)
  })

  it('belongs to the `facets` x-module', () => {
    const { filterWrapper } = renderEditableNumberRangeFilter()
    expect(getXComponentXModuleName(filterWrapper.vm)).toEqual('facets')
  })

  it('renders the provided filter by default', () => {
    const { filterWrapper, applyButtonWrapper, clearButtonWrapper } =
      renderEditableNumberRangeFilter({
        range: { min: 1, max: 5 },
      })
    expect(
      (filterWrapper.find(getDataTestSelector('range-min')).element as HTMLInputElement).value,
    ).toBe('1')
    expect(
      (filterWrapper.find(getDataTestSelector('range-max')).element as HTMLInputElement).value,
    ).toBe('5')
    expect(applyButtonWrapper.text()).toBe('✓')
    expect(clearButtonWrapper.text()).toBe('𐄂')
  })

  it('does not emit UserModifiedEditableNumberRangeFilter event when values are invalid', async () => {
    const { typeMin } = renderEditableNumberRangeFilter({
      range: { min: 1, max: 5 },
      isInstant: true,
    })

    const listener = vi.fn()
    XPlugin.bus.on('UserModifiedEditableNumberRangeFilter').subscribe(listener)

    await typeMin(6)
    expect(listener).not.toHaveBeenCalled()
  })

  it('adds the error class to the root element when the range values are invalid', async () => {
    const { filterWrapper, typeMin } = renderEditableNumberRangeFilter({
      range: { min: 1, max: 5 },
    })

    const rootWrapper = filterWrapper.find(getDataTestSelector('editable-number-range-filter'))

    expect(rootWrapper.classes()).not.toContain('x-editable-number-range-filter--error')

    await typeMin(6)

    expect(rootWrapper.classes()).toContain('x-editable-number-range-filter--error')
  })

  describe('formatRangeValue testing', () => {
    const formattedSlotTemplate = `
      <EditableNumberRangeFilterComponent :filter="filter">
        <template #default="{ range, formatRangeValue }">
          <span data-test="formatted-min">{{ formatRangeValue(range.min) }}</span>
          <span data-test="formatted-max">{{ formatRangeValue(range.max) }}</span>
        </template>
      </EditableNumberRangeFilterComponent>
    `

    it('formats the range values using the filter unit and the snippet config uiLang', () => {
      const { filterWrapper } = renderEditableNumberRangeFilter({
        template: formattedSlotTemplate,
        range: { min: 1234.5, max: 100 },
        unit: 'currency',
        snippetConfig: { uiLang: 'es-ES', currency: 'EUR' },
      })

      expect(filterWrapper.find('[data-test="formatted-min"]').text()).toBe('1234,50\u00A0€')
      expect(filterWrapper.find('[data-test="formatted-max"]').text()).toBe('100,00\u00A0€')
    })

    it('formats the range values as percent when the filter unit is percent', () => {
      const { filterWrapper } = renderEditableNumberRangeFilter({
        template: formattedSlotTemplate,
        range: { min: 0.15, max: 0.5 },
        unit: 'percent',
        snippetConfig: { uiLang: 'en-US' },
      })

      expect(filterWrapper.find('[data-test="formatted-min"]').text()).toBe('15%')
      expect(filterWrapper.find('[data-test="formatted-max"]').text()).toBe('50%')
    })

    it('formats the range values as decimal numbers when the filter unit is decimal', () => {
      const { filterWrapper } = renderEditableNumberRangeFilter({
        template: formattedSlotTemplate,
        range: { min: 1234567, max: 10 },
        unit: 'decimal',
        snippetConfig: { uiLang: 'es-ES' },
      })

      expect(filterWrapper.find('[data-test="formatted-min"]').text()).toBe('1.234.567')
      expect(filterWrapper.find('[data-test="formatted-max"]').text()).toBe('10')
    })
  })

  it('renders empty inputs when the range values are null', () => {
    const { minInputWrapper, maxInputWrapper } = renderEditableNumberRangeFilter({
      range: { min: null, max: null },
      unit: 'currency',
      snippetConfig: { uiLang: 'es-ES', currency: 'EUR' },
    })

    expect((minInputWrapper.element as HTMLInputElement).value).toBe('')
    expect((maxInputWrapper.element as HTMLInputElement).value).toBe('')
  })

  it('parses the value typed in an input', async () => {
    const { typeMin, typeMax, applyButtonWrapper } = renderEditableNumberRangeFilter({
      range: { min: null, max: null },
    })

    const listener = vi.fn()
    XPlugin.bus.on('UserModifiedEditableNumberRangeFilter').subscribe(listener)

    await typeMin('1500.5')
    await typeMax('2000')
    await applyButtonWrapper.trigger('click')

    expect(listener).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        range: { min: 1500.5, max: 2000 },
      }),
    )
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('resets the value to the threshold when an input is emptied', async () => {
    const { typeMin, minInputWrapper } = renderEditableNumberRangeFilter({
      range: { min: 10, max: 20 },
    })

    await typeMin('15')
    expect((minInputWrapper.element as HTMLInputElement).value).toBe('15')

    await typeMin('')
    expect((minInputWrapper.element as HTMLInputElement).value).toBe('10')
  })

  it('updates the inputs without emitting UserModifiedEditableNumberRangeFilter when an input is changed', async () => {
    const { typeMin, typeMax, minInputWrapper, maxInputWrapper } = renderEditableNumberRangeFilter({
      range: { min: 1, max: 5 },
      isInstant: true,
    })

    const listener = vi.fn()
    XPlugin.bus.on('UserModifiedEditableNumberRangeFilter').subscribe(listener)

    await typeMin(2)

    expect((minInputWrapper.element as HTMLInputElement).value).toBe('2')
    expect((maxInputWrapper.element as HTMLInputElement).value).toBe('5')

    await typeMax(4)

    expect((minInputWrapper.element as HTMLInputElement).value).toBe('2')
    expect((maxInputWrapper.element as HTMLInputElement).value).toBe('4')

    expect(listener).not.toHaveBeenCalled()
  })

  it('does not emit UserModifiedEditableNumberRangeFilter event when isInstant is false and an input is changed', async () => {
    const { typeMin, typeMax } = renderEditableNumberRangeFilter({
      range: { min: 1, max: 5 },
    })

    const listener = vi.fn()
    XPlugin.bus.on('UserModifiedEditableNumberRangeFilter', true).subscribe(listener)

    await typeMin(2)
    await typeMax(5)
    expect(listener).not.toHaveBeenCalled()
  })

  describe('clear button testing', () => {
    it('resets min and max component values to the threshold on clear button click', async () => {
      const {
        typeMin,
        typeMax,
        clearButtonWrapper,
        applyButtonWrapper,
        minInputWrapper,
        maxInputWrapper,
      } = renderEditableNumberRangeFilter({
        range: { min: null, max: null },
      })

      const listener = vi.fn()
      XPlugin.bus.on('UserModifiedEditableNumberRangeFilter').subscribe(listener)

      await typeMin(10)
      await typeMax(20)
      await clearButtonWrapper.trigger('click')

      expect((minInputWrapper.element as HTMLInputElement).value).toBe('0')
      expect((maxInputWrapper.element as HTMLInputElement).value).toBe(
        String(Number.MAX_SAFE_INTEGER),
      )

      await applyButtonWrapper.trigger('click')
      expect(listener).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          range: { min: 0, max: Number.MAX_SAFE_INTEGER },
        }),
      )
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('renders the clear button even when there are no values', () => {
      const { clearButtonWrapper } = renderEditableNumberRangeFilter({
        range: { min: null, max: null },
      })

      expect(clearButtonWrapper.exists()).toBeTruthy()
      expect(clearButtonWrapper.text()).toBe('𐄂')
    })
  })

  it('renders BaseSlider as root element with the range as modelValue and the filter range as threshold', () => {
    const { filterWrapper } = renderEditableNumberRangeFilter({
      range: { min: 1, max: 5 },
    })

    const baseSliderWrapper = filterWrapper.findComponent(BaseSlider)

    expect(baseSliderWrapper.exists()).toBeTruthy()
    expect(baseSliderWrapper.props('modelValue')).toEqual({ min: 1, max: 5 })
    expect(baseSliderWrapper.props('threshold')).toEqual({ min: 1, max: 5 })
    expect(
      filterWrapper.find(getDataTestSelector('editable-number-range-filter')).exists(),
    ).toBeTruthy()
  })

  it('uses 0 and Number.MAX_SAFE_INTEGER as threshold when the filter range is empty', () => {
    const { filterWrapper } = renderEditableNumberRangeFilter({
      range: { min: null, max: null },
    })

    const baseSliderWrapper = filterWrapper.findComponent(BaseSlider)

    expect(baseSliderWrapper.props('modelValue')).toEqual({ min: null, max: null })
    expect(baseSliderWrapper.props('threshold')).toEqual({
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
    })
  })

  it('updates the component range when BaseSlider emits update:modelValue', async () => {
    const { filterWrapper, minInputWrapper, maxInputWrapper } = renderEditableNumberRangeFilter({
      range: { min: 1, max: 5 },
    })

    const baseSliderWrapper = filterWrapper.findComponent(BaseSlider)

    baseSliderWrapper.vm.$emit('update:modelValue', { min: 2, max: 4 })
    await nextTick()

    expect(baseSliderWrapper.props('modelValue')).toEqual({ min: 2, max: 4 })
    expect((minInputWrapper.element as HTMLInputElement).value).toBe('2')
    expect((maxInputWrapper.element as HTMLInputElement).value).toBe('4')
  })

  it('updates the range without emitting UserModifiedEditableNumberRangeFilter when the slider changes', async () => {
    const { filterWrapper, minInputWrapper, maxInputWrapper } = renderEditableNumberRangeFilter({
      range: { min: 1, max: 5 },
      isInstant: true,
    })

    const listener = vi.fn()
    XPlugin.bus.on('UserModifiedEditableNumberRangeFilter').subscribe(listener)

    const baseSliderWrapper = filterWrapper.findComponent(BaseSlider)

    baseSliderWrapper.vm.$emit('update:modelValue', { min: 2, max: 4 })
    await nextTick()

    expect((minInputWrapper.element as HTMLInputElement).value).toBe('2')
    expect((maxInputWrapper.element as HTMLInputElement).value).toBe('4')
    expect(listener).not.toHaveBeenCalled()
  })

  it('keeps the slider values until the apply button is clicked when isInstant is false', async () => {
    const { filterWrapper, applyButtonWrapper, minInputWrapper } = renderEditableNumberRangeFilter({
      range: { min: 1, max: 5 },
    })

    const listener = vi.fn()
    XPlugin.bus.on('UserModifiedEditableNumberRangeFilter').subscribe(listener)

    const baseSliderWrapper = filterWrapper.findComponent(BaseSlider)

    baseSliderWrapper.vm.$emit('update:modelValue', { min: 2, max: 4 })
    await nextTick()

    expect(listener).not.toHaveBeenCalled()
    expect((minInputWrapper.element as HTMLInputElement).value).toBe('2')

    await applyButtonWrapper.trigger('click')

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        range: { min: 2, max: 4 },
      }),
    )
  })
})
