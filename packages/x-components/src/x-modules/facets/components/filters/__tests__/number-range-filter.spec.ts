import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { createNumberRangeFilter } from '../../../../../__stubs__/filters-stubs.factory'
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../../components'
import { XPlugin } from '../../../../../plugins'
import NumberRangeFilter from '../number-range-filter.vue'

const metadata = {
  moduleName: 'facets',
  location: 'none',
  replaceable: true,
}

function render({
  template = '<NumberRangeFilter :filter="filter" :clickEvents="clickEvents" />',
  filter = ref(createNumberRangeFilter('price', { min: 0, max: 20 })),
  clickEvents = {},
} = {}) {
  const wrapper = mount(
    {
      components: { NumberRangeFilter },
      template,
    },
    {
      data: () => ({ filter, clickEvents }),
      global: { plugins: [installNewXPlugin()] },
    },
  )

  const filterWrapper = wrapper.findComponent(NumberRangeFilter)
  const buttonWrapper = filterWrapper.find(getDataTestSelector('filter'))

  return {
    wrapper: filterWrapper,
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
    filter,
    buttonWrapper,
    clickFilter: async () => buttonWrapper.trigger('click'),
    selectFilter: async () => {
      filter.value.selected = true
      return nextTick()
    },
  }
}

describe('testing NumberRangeFilter component', () => {
  it('is an XComponent that belongs to the facets', () => {
    const { wrapper } = render()

    expect(isXComponent(wrapper.vm)).toBeTruthy()
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets')
  })

  it('renders the provided filter by default', () => {
    const { wrapper, filter } = render()

    expect(wrapper.text()).toEqual(filter.value.label)
  })

  it('emits `UserClickedAFilter` & `UserClickedANumberRangeFilter` events when clicked', async () => {
    const { clickFilter, emitSpy, filter } = render()

    await clickFilter()

    expect(emitSpy).toHaveBeenCalledTimes(2)
    ;['UserClickedAFilter', 'UserClickedANumberRangeFilter'].forEach(event => {
      expect(emitSpy).toHaveBeenCalledWith(event, filter.value, metadata)
    })
  })

  it('emits configured events when clicked', async () => {
    const { clickFilter, emitSpy, filter } = render({
      clickEvents: { UserAcceptedAQuery: 'potato' },
    })

    await clickFilter()

    expect(emitSpy).toHaveBeenCalledTimes(3)
    ;['UserClickedAFilter', 'UserClickedANumberRangeFilter'].forEach(event => {
      expect(emitSpy).toHaveBeenCalledWith(event, filter.value, metadata)
    })
    expect(emitSpy).toHaveBeenNthCalledWith(3, 'UserAcceptedAQuery', 'potato', metadata)
  })

  it('allows customizing the rendered content with an slot', () => {
    const { wrapper, filter } = render({
      template: `
        <NumberRangeFilter :filter="filter" :clickEvents="clickEvents" v-slot="{ filter }">
          <span data-test="custom-label">{{ filter.label }}</span>
        </NumberRangeFilter>`,
    })

    const customLabel = wrapper.find(getDataTestSelector('custom-label'))
    expect(customLabel.text()).toEqual(filter.value.label)
  })

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { buttonWrapper, selectFilter } = render()

    expect(buttonWrapper.classes()).not.toContain('xds:selected')
    expect(buttonWrapper.classes()).not.toContain('x-number-range-filter--is-selected')

    await selectFilter()

    expect(buttonWrapper.classes()).toContain('xds:selected')
    expect(buttonWrapper.classes()).toContain('x-number-range-filter--is-selected')
  })
})
