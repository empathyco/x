import type { RangeValue } from '@empathyco/x-types'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { createEditableNumberRangeFilter } from '../../../../../__stubs__/filters-stubs.factory'
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../../components/x-component.utils'
import { XPlugin } from '../../../../../plugins'
import EditableNumberRangeFilterComponent from '../editable-number-range-filter.vue'

Object.defineProperty(HTMLInputElement.prototype, 'valueAsNumber', {
  get() {
    return Number.parseFloat(this.value)
  },
  configurable: true,
  enumerable: true,
})

function renderEditableNumberRangeFilter({
  template = `
    <EditableNumberRangeFilterComponent
      :filter="filter"
      :isInstant="isInstant"
      :hasClearButton="hasClearButton"
      :buttonsClass="buttonsClass"
      :inputsClass="inputsClass"
    />
  `,
  range = { min: null, max: null } as RangeValue,
  isInstant = false,
  hasClearButton = true,
  buttonsClass = '',
  inputsClass = '',
} = {}) {
  const filter = ref(createEditableNumberRangeFilter('age', range))

  const wrapper = mount(
    {
      components: { EditableNumberRangeFilterComponent },
      template,
    },
    {
      data: () => ({
        filter,
        isInstant,
        hasClearButton,
        buttonsClass,
        inputsClass,
      }),
      global: { plugins: [installNewXPlugin()] },
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

    const listener = jest.fn()
    XPlugin.bus.on('UserModifiedEditableNumberRangeFilter').subscribe(listener)

    await typeMin(6)
    expect(listener).not.toHaveBeenCalled()
  })

  it('emits UserModifiedEditableNumberRangeFilter event when isInstant is true and an input is changed', async () => {
    const { typeMin, typeMax } = renderEditableNumberRangeFilter({
      range: { min: 1, max: 5 },
      isInstant: true,
    })

    const listener = jest.fn()
    XPlugin.bus.on('UserModifiedEditableNumberRangeFilter').subscribe(listener)

    await typeMin(2)

    expect(listener).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        range: {
          min: 2,
          max: 5,
        },
      }),
    )

    await typeMax(7)

    expect(listener).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        range: {
          min: 2,
          max: 7,
        },
      }),
    )

    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('does not emit UserModifiedEditableNumberRangeFilter event when isInstant is false and an input is changed', async () => {
    const { typeMin, typeMax } = renderEditableNumberRangeFilter({
      range: { min: 1, max: 5 },
    })

    const listener = jest.fn()
    XPlugin.bus.on('UserModifiedEditableNumberRangeFilter', true).subscribe(listener)

    await typeMin(2)
    await typeMax(5)
    expect(listener).not.toHaveBeenCalled()
  })

  describe('clear button testing', () => {
    it('sets min and max component values to null on clear button click', async () => {
      const { clearButtonWrapper, applyButtonWrapper } = renderEditableNumberRangeFilter({
        range: { min: 1, max: 5 },
      })

      const listener = jest.fn()
      XPlugin.bus.on('UserModifiedEditableNumberRangeFilter').subscribe(listener)

      await clearButtonWrapper.trigger('click')
      await applyButtonWrapper.trigger('click')
      expect(listener).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          range: { min: null, max: null },
        }),
      )
      expect(listener).toHaveBeenCalledTimes(1)
    })

    it('does not render a clear button if hasClearButton is false', () => {
      const { clearButtonWrapper } = renderEditableNumberRangeFilter({
        range: { min: 1, max: 5 },
        hasClearButton: false,
      })

      expect(clearButtonWrapper.exists()).toBe(false)
    })

    it('does not render a clear button if hasClearButton is true and there are no values', () => {
      const { clearButtonWrapper } = renderEditableNumberRangeFilter({
        range: { min: null, max: null },
        hasClearButton: true,
      })

      expect(clearButtonWrapper.exists()).toBe(false)
    })
  })

  describe('slots testing', () => {
    it('allows to customize apply-content slot', () => {
      const { applyButtonWrapper } = renderEditableNumberRangeFilter({
        template: `
          <EditableNumberRangeFilterComponent :filter="filter">
            <template #apply-content>Apply</template>
          </EditableNumberRangeFilterComponent>`,
        range: { min: 1, max: 5 },
      })

      expect(applyButtonWrapper.text()).toBe('Apply')
    })

    it('allows to customize clear-content slot', () => {
      const { clearButtonWrapper } = renderEditableNumberRangeFilter({
        template: `
          <EditableNumberRangeFilterComponent :filter="filter">
            <template #clear-content>Clear</template>
          </EditableNumberRangeFilterComponent>`,
        range: { min: 1, max: 5 },
      })

      expect(clearButtonWrapper.text()).toBe('Clear')
    })

    it('allows adding classes to the inputs and the buttons', () => {
      const { maxInputWrapper, minInputWrapper, applyButtonWrapper, clearButtonWrapper } =
        renderEditableNumberRangeFilter({
          inputsClass: 'custom-inputs-class',
          buttonsClass: 'custom-buttons-class',
          hasClearButton: true,
          range: {
            min: 1,
            max: 5,
          },
        })

      expect(minInputWrapper.classes()).toContain('custom-inputs-class')
      expect(maxInputWrapper.classes()).toContain('custom-inputs-class')

      expect(applyButtonWrapper.classes()).toContain('custom-buttons-class')
      expect(clearButtonWrapper.classes()).toContain('custom-buttons-class')
    })

    it('allows to customize the default slot', async () => {
      const { filterWrapper, applyButtonWrapper, clearButtonWrapper, typeMin, typeMax } =
        renderEditableNumberRangeFilter({
          template: `
            <EditableNumberRangeFilterComponent
              :filter="filter"
              #default="{
                min,
                max,
                setMin,
                setMax,
                emitUserModifiedFilter,
                clearValues,
                hasError
              }"
            >
              <button @click="emitUserModifiedFilter" data-test="range-apply">
                ✅ Apply!
              </button>
              <button @click="clearValues" data-test="range-clear">🗑 Clear!</button>
              <input
                :value="min"
                @change="setMin($event.target.valueAsNumber)"
                data-test="range-min"
              />
              <input
                :value="max"
                @change="setMax($event.target.valueAsNumber)"
                data-test="range-max"
              />
              <div data-test="has-error" v-if="hasError">⚠️ Invalid range values</div>
            </EditableNumberRangeFilterComponent>
          `,
          range: { min: 7, max: 4 },
        })

      const listener = jest.fn()
      XPlugin.bus.on('UserModifiedEditableNumberRangeFilter').subscribe(listener)

      expect(applyButtonWrapper.text()).toBe('✅ Apply!')
      expect(clearButtonWrapper.text()).toBe('🗑 Clear!')

      expect(filterWrapper.find(getDataTestSelector('has-error')).text()).toBe(
        '⚠️ Invalid range values',
      )

      await typeMin(4)
      await typeMax(6)
      await applyButtonWrapper.trigger('click')
      expect(listener).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          range: {
            min: 4,
            max: 6,
          },
        }),
      )

      await clearButtonWrapper.trigger('click')
      await applyButtonWrapper.trigger('click')
      expect(listener).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          range: {
            min: null,
            max: null,
          },
        }),
      )

      expect(listener).toHaveBeenCalledTimes(2)
    })
  })
})
