import type { RelatedPrompt } from '@empathyco/x-types'
import type { DeepPartial } from '@empathyco/x-utils'
import type { RequestStatus, RootXStoreState } from '../../../../store'
import type { ListItem } from '../../../../utils/types'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick, provide, ref } from 'vue'
import { Store } from 'vuex'
import { getRelatedPromptsStub } from '../../../../__stubs__'
import { installNewXPlugin, resetStoreXModuleState } from '../../../../__tests__/utils'
import {
  getXComponentXModuleName,
  isXComponent,
  LIST_ITEMS_KEY,
  QUERY_KEY,
} from '../../../../components'
import { relatedPromptsXStoreModule } from '../../store/module'
import { relatedPromptsXModule } from '../../x-module'
import RelatedPromptsList from '../related-prompts-list.vue'

/**
 * Creates a list of {@link ListItem} of the given length.
 *
 * @param length - The length of the list to create.
 * @returns A list of simple {@link ListItem}s.
 */
function createExtraItems(length: number): ListItem[] {
  return Array.from({ length }, (_, index) => ({
    id: `Extra ${index}`,
    modelName: 'ExtraItem',
  }))
}

async function render({
  relatedPrompts = [] as RelatedPrompt[],
  query = 'jacket',
  status = 'initial' as RequestStatus,
  searchQuery = 'jacket',
  extraItems = [] as ListItem[],
  offset = 4,
  frequency = 8,
  maxRelatedPromptsPerGroup = 2,
  maxGroups = undefined as undefined | number,
  showOnlyAfterOffset = false,
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const wrapper = mount(
    {
      template: `
        <RelatedPromptsList>
          <template #related-prompts-group="{ item }">
            <ul
              class="related-prompts-group"
              :data-empty="item.relatedPrompts.length === 0 ? 'true' : 'false'"
            >
              <li v-for="relatedPrompt in item.relatedPrompts" :key="relatedPrompt.suggestionText">
                {{ relatedPrompt.suggestionText }}
              </li>
            </ul>
          </template>
        </RelatedPromptsList>`,
      components: { RelatedPromptsList },
      setup() {
        provide(LIST_ITEMS_KEY as string, ref(extraItems))
        provide(QUERY_KEY as string, ref(searchQuery))
      },
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [relatedPromptsXModule] })],
      },
      props: { offset, frequency, maxRelatedPromptsPerGroup, maxGroups, showOnlyAfterOffset },
    },
  )

  resetStoreXModuleState(store, 'relatedPrompts', relatedPromptsXStoreModule.state(), {
    relatedPrompts,
    query,
    status,
  })
  await nextTick()

  const relatedPromptsListWrapper = wrapper.findComponent(RelatedPromptsList)

  return {
    store,
    wrapper: relatedPromptsListWrapper,
    getRelatedPromptsGroupWrappers: () =>
      relatedPromptsListWrapper.findAll('.related-prompts-group'),
    getRenderedItemsText: () =>
      relatedPromptsListWrapper.findAll('[data-test$="-list-item"]').map(item => item.text()),
  }
}

describe('testing RelatedPromptsList component', () => {
  it('is an XComponent and has RelatedPrompts as XModule', async () => {
    const { wrapper } = await render()

    expect(isXComponent(wrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('relatedPrompts')
  })

  describe('placeholder group', () => {
    it('renders an empty placeholder group when the related prompts have not been requested yet', async () => {
      const { getRelatedPromptsGroupWrappers } = await render({
        status: 'initial',
        extraItems: createExtraItems(12),
      })

      expect(getRelatedPromptsGroupWrappers()).toHaveLength(1)
      expect(getRelatedPromptsGroupWrappers()[0].attributes('data-empty')).toBe('true')
    })

    it('renders an empty placeholder group while the related prompts request is loading', async () => {
      const { getRelatedPromptsGroupWrappers } = await render({
        status: 'loading',
        extraItems: createExtraItems(12),
      })

      expect(getRelatedPromptsGroupWrappers()).toHaveLength(1)
      expect(getRelatedPromptsGroupWrappers()[0].attributes('data-empty')).toBe('true')
    })

    it('does not render a placeholder group once the related prompts have been loaded', async () => {
      const { getRelatedPromptsGroupWrappers } = await render({
        relatedPrompts: getRelatedPromptsStub(2),
        status: 'success',
        extraItems: createExtraItems(12),
      })

      expect(getRelatedPromptsGroupWrappers()).toHaveLength(1)
      expect(getRelatedPromptsGroupWrappers()[0].attributes('data-empty')).toBe('false')
    })

    it('does not render a placeholder group when the related prompts request has failed', async () => {
      const { getRelatedPromptsGroupWrappers } = await render({ status: 'error' })

      expect(getRelatedPromptsGroupWrappers()).toHaveLength(0)
    })

    it('does not render a placeholder group when there are no related prompts to show', async () => {
      const { getRelatedPromptsGroupWrappers } = await render({
        relatedPrompts: [],
        status: 'success',
      })

      expect(getRelatedPromptsGroupWrappers()).toHaveLength(0)
    })

    it('does not render a placeholder group when the related prompts are outdated', async () => {
      const { getRelatedPromptsGroupWrappers } = await render({
        relatedPrompts: getRelatedPromptsStub(2),
        query: 'old-query',
        searchQuery: 'jacket',
        status: 'success',
      })

      expect(getRelatedPromptsGroupWrappers()).toHaveLength(0)
    })

    it('renders the placeholder group in the same position as the first related prompts group', async () => {
      const { store, getRelatedPromptsGroupWrappers, getRenderedItemsText } = await render({
        extraItems: createExtraItems(12),
        offset: 4,
        status: 'loading',
      })

      const renderedItems = getRenderedItemsText()
      expect(renderedItems).toHaveLength(13)
      expect(renderedItems[4]).toBe('')
      expect(getRelatedPromptsGroupWrappers()[0].attributes('data-empty')).toBe('true')

      store.commit('x/relatedPrompts/setRelatedPromptsProducts', getRelatedPromptsStub(2))
      store.commit('x/relatedPrompts/setStatus', 'success')
      await nextTick()

      const loadedRenderedItems = getRenderedItemsText()
      expect(loadedRenderedItems).toHaveLength(13)
      expect(loadedRenderedItems[4]).toBe('Related Prompt 1Related Prompt 2')
    })
  })
})
