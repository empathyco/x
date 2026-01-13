import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import {
  createSimpleFilter,
  getSimpleFilterStub,
} from '../../../../../__stubs__/filters-stubs.factory'
import { getDataTestSelector, installNewXPlugin } from '../../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../../components'
import { XPlugin } from '../../../../../plugins'
import RenderlessFilter from '../renderless-filter.vue'

function render({
  filter = ref(createSimpleFilter('category', 'food')),
  clickEvents = {},
  template = `
    <RenderlessFilter
      :filter="filter"
      :clickEvents="clickEvents"
      v-slot="{ filter, clickFilter, cssClasses, isDisabled }">
        <button
          @click="clickFilter"
          :class="cssClasses"
          :disabled="isDisabled"
          data-test="custom-label"
        >
          {{ filter.label }}
        </button>
    </RenderlessFilter>`,
} = {}) {
  const wrapper = mount(
    {
      components: { RenderlessFilter },
      template,
    },
    {
      data: () => ({ filter, clickEvents }),
      global: { plugins: [installNewXPlugin()] },
    },
  )

  const renderlessFilterWrapper = wrapper.findComponent(RenderlessFilter)
  const buttonWrapper = renderlessFilterWrapper.find(getDataTestSelector('custom-label'))

  return {
    wrapper: renderlessFilterWrapper,
    emitSpy: jest.spyOn(XPlugin.bus, 'emit'),
    filter,
    buttonWrapper,
    clickFilter: async () => buttonWrapper.trigger('click'),
    selectFilter: async () => {
      filter.value.selected = true
      await nextTick()
    },
  }
}

describe('testing Renderless Filter component', () => {
  it('is an XComponent that belongs to the facets', () => {
    const { wrapper } = render()

    expect(isXComponent(wrapper.vm)).toBeTruthy()
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('facets')
  })

  it('emits UserClickedAFilter and other custom events when clicked', async () => {
    const filter = ref(getSimpleFilterStub())
    const { clickFilter, emitSpy } = render({
      filter,
      clickEvents: { UserClickedASimpleFilter: filter.value },
    })
    const metadata = {
      moduleName: 'facets',
      location: 'none',
      replaceable: true,
    }

    await clickFilter()

    expect(emitSpy).toHaveBeenCalledTimes(2)
    expect(emitSpy).toHaveBeenCalledWith('UserClickedAFilter', filter.value, metadata)
    expect(emitSpy).toHaveBeenCalledWith('UserClickedASimpleFilter', filter.value, metadata)
  })

  it('allows customizing the rendered content with an slot', () => {
    const { wrapper, filter } = render()

    const customLabel = wrapper.find(getDataTestSelector('custom-label'))
    expect(customLabel.text()).toEqual(filter.value.label)
  })

  it('adds selected classes to the rendered element when the filter is selected', async () => {
    const { buttonWrapper, selectFilter } = render()

    expect(buttonWrapper.classes()).not.toContain('xds:selected')

    await selectFilter()

    expect(buttonWrapper.classes()).toContain('xds:selected')
  })

  it('disables the filter when it has no results', async () => {
    const filter = ref(createSimpleFilter('category', 'men', false))
    const { buttonWrapper } = render({ filter })

    expect(buttonWrapper.attributes()).not.toHaveProperty('disabled')

    filter.value.totalResults = 0
    await nextTick()

    expect(buttonWrapper.attributes()).toHaveProperty('disabled')
  })
})
