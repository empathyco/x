import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store/index'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import FallbackDisclaimer from '../fallback-disclaimer.vue'
import { resetXSearchStateWith } from './utils'

function renderFallbackDisclaimer({
  template = `<FallbackDisclaimer/>`,
  query = '',
  fromNoResultsWithFilters = false,
}: RenderFallbackDisclaimerOptions = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const wrapper = mount(
    {
      components: {
        FallbackDisclaimer,
      },
      template,
    },
    {
      global: {
        plugins: [installNewXPlugin({ store })],
      },
    },
  )

  resetXSearchStateWith(store, {
    query,
    fromNoResultsWithFilters,
  })

  return {
    wrapper: wrapper.findComponent(FallbackDisclaimer),
  }
}

describe('testing Fallback disclaimer component', () => {
  it('does not render any content when there is no results with filters', () => {
    const { wrapper } = renderFallbackDisclaimer()

    expect(wrapper.find('.x-fallback-disclaimer').exists()).toBe(false)
  })

  it('renders the message when there is no results with filters', async () => {
    const query = 'shirt'

    const message = `No results found for ${query} with the selected filters. The filters have been unselected.`
    const { wrapper } = renderFallbackDisclaimer({ fromNoResultsWithFilters: true, query })
    await nextTick()
    expect(wrapper.find(getDataTestSelector('fallback-disclaimer')).text()).toBe(message)
  })

  it('renders a custom fallback disclaimer message', async () => {
    const { wrapper } = renderFallbackDisclaimer({
      template: `
      <FallbackDisclaimer>
        <template #default="{ query }">
          No results found for '{{ query }}'. Filters deselected
        </template>
      </FallbackDisclaimer>
      `,
      query: 'dress',
      fromNoResultsWithFilters: true,
    })
    await nextTick()
    expect(wrapper.find(getDataTestSelector('fallback-disclaimer')).text()).toBe(
      "No results found for 'dress'. Filters deselected",
    )
  })
})

interface RenderFallbackDisclaimerOptions {
  /** The template to be rendered. */
  template?: string
  /** The query to display in the fallback disclaimer. */
  query?: string
  /** Indicates if a request with filters applied had no results. */
  fromNoResultsWithFilters?: boolean
}
