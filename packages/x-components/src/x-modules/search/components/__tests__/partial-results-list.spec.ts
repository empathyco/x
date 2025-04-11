import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { getPartialResultsStub } from '../../../../__stubs__'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components'
import { searchXModule } from '../../x-module'
import PartialResultsList from '../partial-results-list.vue'
import { resetXSearchStateWith } from './utils'

/**
 * Renders the `PartialResultsList` component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @param options.template - template option.
 * @param options.partialResults - partialResults option.
 * @returns The API for testing the `PartialResultsList` component.
 */
function renderPartialResultsList({
  template = '<PartialResultsList />',
  partialResults = getPartialResultsStub(),
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const wrapper = mount(
    {
      components: {
        PartialResultsList,
      },
      template,
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [searchXModule] })],
      },
      store,
    },
  )

  resetXSearchStateWith(store, { partialResults })

  const partialResultsListWrapper = wrapper.findComponent(PartialResultsList)

  return {
    partialResultsListWrapper,
    getPartialResults: () => partialResults,
  }
}
describe('testing Partial results list component', () => {
  it('is an XComponent', () => {
    const { partialResultsListWrapper } = renderPartialResultsList()
    expect(isXComponent(partialResultsListWrapper.vm)).toEqual(true)
  })

  it('has Search as XModule', () => {
    const { partialResultsListWrapper } = renderPartialResultsList()
    expect(getXComponentXModuleName(partialResultsListWrapper.vm)).toEqual('search')
  })

  it('renders the partial results in the state', async () => {
    const { partialResultsListWrapper, getPartialResults } = renderPartialResultsList()
    await nextTick()
    const partialResultsItems = partialResultsListWrapper.findAll(
      getDataTestSelector('partial-result'),
    )
    expect(partialResultsItems).toHaveLength(getPartialResults().length)
  })

  it('does not render any partial results if the are none', () => {
    const { partialResultsListWrapper } = renderPartialResultsList({ partialResults: [] })
    expect(partialResultsListWrapper.find(getDataTestSelector('partial-results')).exists()).toBe(
      false,
    )
  })

  it('allows customizing the default slot', async () => {
    const { partialResultsListWrapper } = renderPartialResultsList({
      template: `
        <PartialResultsList>
          <template #default="{ partialResult }">
            <p data-test="partial-slot-overridden">{{ partialResult.query }}</p>
          </template>
        </PartialResultsList>`,
    })

    await nextTick()

    expect(partialResultsListWrapper.find(getDataTestSelector('partial-results')).exists()).toEqual(
      true,
    )
    expect(
      partialResultsListWrapper.find(getDataTestSelector('partial-slot-overridden')).exists(),
    ).toEqual(true)
  })
})
