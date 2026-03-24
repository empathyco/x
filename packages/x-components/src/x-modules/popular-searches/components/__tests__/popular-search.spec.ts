import type { Suggestion } from '@empathyco/x-types'
import type { DeepPartial } from '@empathyco/x-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { RootXStoreState } from '../../../../store/store.types'
import type { WireMetadata } from '../../../../wiring/wiring.types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { Store } from 'vuex'
import { createPopularSearch } from '../../../../__stubs__/popular-searches-stubs.factory'
import { installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils'
import { XPlugin } from '../../../../plugins/index'
import { popularSearchesXModule } from '../../x-module'
import PopularSearch from '../popular-search.vue'

function renderPopularSearch({
  suggestion = createPopularSearch('baileys'),
  template = '<PopularSearch v-bind="$attrs"/>',
}: RenderPopularSearchOptions = {}): RenderPopularSearchApi {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const wrapper = mount(
    {
      template,
      inheritAttrs: false,
      components: {
        PopularSearch,
      },
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [popularSearchesXModule] })],
      },
      props: { suggestion },
      store,
    },
  )

  return {
    wrapper: wrapper.findComponent(PopularSearch),
    suggestion,
    emitSpy: vi.spyOn(XPlugin.bus, 'emit'),
  }
}

describe('testing popular-search component', () => {
  it('is an XComponent that belongs to the popular searches', () => {
    const { wrapper } = renderPopularSearch()
    expect(isXComponent(wrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('popularSearches')
  })

  it('renders the suggestion received as prop', () => {
    const { wrapper } = renderPopularSearch({
      suggestion: createPopularSearch('milk'),
    })
    expect(wrapper.text()).toEqual('milk')
  })

  it('emits appropriate events on click', async () => {
    const { wrapper, emitSpy, suggestion } = renderPopularSearch({
      suggestion: createPopularSearch('milk'),
    })

    await wrapper.trigger('click')

    const expectedMetadata = expect.objectContaining<Partial<WireMetadata>>({
      moduleName: 'popularSearches',
      target: wrapper.element,
      feature: 'popular_search',
    })
    expect(emitSpy).toHaveBeenCalledWith('UserAcceptedAQuery', suggestion.query, expectedMetadata)
    expect(emitSpy).toHaveBeenCalledWith('UserSelectedASuggestion', suggestion, expectedMetadata)
    expect(emitSpy).toHaveBeenCalledWith('UserSelectedAPopularSearch', suggestion, expectedMetadata)
  })

  it('allows to customise the rendered content', () => {
    const { wrapper } = renderPopularSearch({
      suggestion: createPopularSearch('baileys'),
      template: `
      <PopularSearch v-bind="$attrs" #default="{ suggestion }">
        <span>🔍</span>
        <span>{{ suggestion.query }}</span>
      </PopularSearch>
      `,
    })

    expect(wrapper.text()).toEqual('🔍baileys')
  })
})

interface RenderPopularSearchOptions {
  /** The suggestion data to render. */
  suggestion?: Suggestion
  /** The template to render. */
  template?: string
}

interface RenderPopularSearchApi {
  /** Testing wrapper of the {@link PopularSearch} component. */
  wrapper: VueWrapper
  /** The {@link XBus.emit} spy. */
  emitSpy: ReturnType<typeof vi.spyOn>
  /** Rendered {@link Suggestion} model data. */
  suggestion: Suggestion
}
