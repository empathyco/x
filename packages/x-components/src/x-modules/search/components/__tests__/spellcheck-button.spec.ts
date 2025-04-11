import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store/index'
import type { WireMetadata } from '../../../../wiring/wiring.types'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { XPlugin } from '../../../../plugins/x-plugin'
import SpellcheckButton from '../spellcheck-button.vue'
import { resetXSearchStateWith } from './utils'

function renderSpellcheckButton({
  template = `<SpellcheckButton />`,
  spellcheckedQuery,
}: RenderSpellcheckButtonOptions = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const wrapper = mount(
    {
      components: {
        SpellcheckButton,
      },
      template,
    },
    {
      global: {
        plugins: [installNewXPlugin({ store })],
      },
    },
  )
  resetXSearchStateWith(store, { query: 'coce', spellcheckedQuery })
  return {
    wrapper,
    async click() {
      await wrapper.trigger('click')
    },
  }
}

describe('testing SpellcheckButton component', () => {
  it('does not render any content when there is not spellcheckedQuery', () => {
    const { wrapper } = renderSpellcheckButton()
    expect(wrapper.find('x-spellcheck-button').exists()).toBe(false)
  })

  it('renders the default spellcheck message', async () => {
    const { wrapper } = renderSpellcheckButton({ spellcheckedQuery: 'coche' })
    await nextTick()
    expect(wrapper.find(getDataTestSelector('set-spellcheck')).text()).toBe('coche')
  })

  it('renders a custom spellcheck message', async () => {
    const { wrapper } = renderSpellcheckButton({
      template: `
    <SpellcheckButton>
      <template #default="{ spellcheckedQuery }">
        <span data-test="set-spellcheck__text" class="x-spellcheck__text">
          Set the Spellcheck as the new query: {{ spellcheckedQuery}}!
        </span>
      </template>
    </SpellcheckButton>
      `,
      spellcheckedQuery: 'coche',
    })
    await nextTick()
    expect(wrapper.find(getDataTestSelector('set-spellcheck__text')).text()).toBe(
      'Set the Spellcheck as the new query: coche!',
    )
  })

  it('emits the UserAcceptedAQuery and UserAcceptSpellcheck events when the button is clicked', async () => {
    const userAcceptedAQuery = jest.fn()
    const userAcceptSpellcheck = jest.fn()
    const spellcheckedQuery = 'coche'
    const { wrapper, click } = renderSpellcheckButton({ spellcheckedQuery })

    XPlugin.bus.on('UserAcceptedAQuery', true).subscribe(userAcceptedAQuery)
    XPlugin.bus.on('UserAcceptedSpellcheckQuery', true).subscribe(userAcceptSpellcheck)

    await nextTick()

    await click()

    expect(userAcceptedAQuery).toHaveBeenNthCalledWith(1, {
      eventPayload: spellcheckedQuery,
      metadata: expect.objectContaining<Partial<WireMetadata>>({
        feature: 'spellcheck',
        target: wrapper.element,
      }),
    })
    expect(userAcceptSpellcheck).toHaveBeenNthCalledWith(1, {
      eventPayload: spellcheckedQuery,
      metadata: expect.objectContaining<Partial<WireMetadata>>({
        feature: 'spellcheck',
        target: wrapper.element,
      }),
    })
  })
})

interface RenderSpellcheckButtonOptions {
  /** The template to be rendered. */
  template?: string
  /** The spellcheckedQuery for the state. */
  spellcheckedQuery?: string
}
