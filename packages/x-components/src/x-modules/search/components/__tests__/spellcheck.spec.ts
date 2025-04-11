import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import Spellcheck from '../spellcheck.vue'
import { resetXSearchStateWith } from './utils'

function renderSpellcheck({
  template = `<Spellcheck/>`,
  spellcheckedQuery,
}: RenderSpellcheckOptions = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const wrapper = mount(
    {
      components: {
        Spellcheck,
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
    query: 'coce',
    spellcheckedQuery,
  })

  return {
    wrapper: wrapper.findComponent(Spellcheck),
  }
}

describe('testing Spellcheck component', () => {
  it('does not render any content when there is not spellcheckedQuery', () => {
    const { wrapper } = renderSpellcheck()
    expect(wrapper.find('.x-spellcheck').exists()).toBe(false)
  })

  it('renders the default spellcheck message', async () => {
    const { wrapper } = renderSpellcheck({ spellcheckedQuery: 'coche' })
    await nextTick()
    expect(wrapper.find('.x-spellcheck').text()).toBe('coce - coche')
  })

  it('renders a custom spellcheck message', async () => {
    const { wrapper } = renderSpellcheck({
      template: `
      <Spellcheck>
        <template #default="{ query, spellcheckedQuery }">
          No results found for '{{ query }}'. We show you results for '{{ spellcheckedQuery }}'
        </template>
      </Spellcheck>
      `,
      spellcheckedQuery: 'coche',
    })
    await nextTick()
    expect(wrapper.find(getDataTestSelector('spellcheck')).text()).toBe(
      "No results found for 'coce'. We show you results for 'coche'",
    )
  })
})

interface RenderSpellcheckOptions {
  /** The template to be rendered. */
  template?: string
  /** The spellcheckedQuery for the state. */
  spellcheckedQuery?: string
}
