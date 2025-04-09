import type { DeepPartial } from '@empathyco/x-utils'
import type { Ref } from 'vue'
import type { RootXStoreState } from '../../../../store'
import type { ListItem } from '../../../../utils/types'
import type { SearchMutations } from '../../store/types'
import { mount } from '@vue/test-utils'
import { defineComponent, inject, nextTick } from 'vue'
import { Store } from 'vuex'
import { getResultsStub, getSearchResponseStub } from '../../../../__stubs__'
import {
  getDataTestSelector,
  getMockedAdapter,
  installNewXPlugin,
} from '../../../../__tests__/utils'
import {
  getXComponentXModuleName,
  HAS_MORE_ITEMS_KEY,
  isXComponent,
  LIST_ITEMS_KEY,
  QUERY_KEY,
} from '../../../../components'
import BaseGrid from '../../../../components/base-grid.vue'
import { searchXModule } from '../../x-module'
import ResultsList from '../results-list.vue'
import { resetXSearchStateWith } from './utils'

const adapter = getMockedAdapter({ search: getSearchResponseStub() })

async function render({
  template = '<ResultsList />',
  results = getResultsStub(),
  components = {},
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const wrapper = mount(
    {
      template,
      components: { ResultsList, ...components },
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [searchXModule], adapter })],
      },
    },
  )

  resetXSearchStateWith(store, { results, totalResults: results.length })
  await nextTick()

  return {
    wrapper: wrapper.findComponent(ResultsList),
    results,
    commit: <Event extends keyof SearchMutations>(
      event: Event,
      payload: Parameters<SearchMutations[Event]>[0],
    ) => {
      store.commit(`x/search/${event}`, payload)
    },
  }
}

describe('testing Results list component', () => {
  it('is an XComponent which has an XModule', async () => {
    const { wrapper } = await render()

    expect(isXComponent(wrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('search')
  })

  it('renders the results in the state', async () => {
    const { wrapper, results } = await render()
    const resultsListItems = wrapper.findAll(getDataTestSelector('results-list-item'))

    results.forEach((result, index) =>
      expect(resultsListItems.at(index)?.text()).toEqual(result.id),
    )
  })

  it('does not render any result if the are none', async () => {
    const { wrapper } = await render({ results: [] })

    expect(wrapper.isVisible()).toEqual(false)
  })

  it('allows customizing the result slot', async () => {
    const { wrapper, results } = await render({
      template: `
        <ResultsList>
          <template #result="{ item }">
            <p data-test="result-slot-overridden">Custom result: {{ item.name }}</p>
          </template>
        </ResultsList>`,
    })

    expect(wrapper.exists()).toEqual(true)
    expect(wrapper.find(getDataTestSelector('items-list')).classes('x-items-list')).toEqual(true)
    expect(wrapper.find(getDataTestSelector('results-list-item')).exists()).toEqual(true)
    expect(wrapper.find(getDataTestSelector('result-slot-overridden')).text()).toEqual(
      `Custom result: ${results[0].name!}`,
    )
  })

  it('allows customizing the default slot', async () => {
    const { wrapper } = await render({
      template: `
        <ResultsList>
          <template #default="{ results }">
            <p data-test="default-slot-overridden"/>
          </template>
        </ResultsList>`,
      components: { BaseGrid },
    })

    expect(wrapper.find(getDataTestSelector('results-list')).exists()).toEqual(false)
    expect(wrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toEqual(true)
  })

  it('provides the results from state with the key `item`', async () => {
    const Child = defineComponent({
      name: 'Child',
      setup: () => ({ items: inject<Ref<ListItem[]>>(LIST_ITEMS_KEY as string) }),
      template: `<div>{{ items?.[0]?.id }}</div>`,
    })

    const { wrapper, results } = await render({
      template: '<ResultsList><Child /></ResultsList>',
      components: { Child },
    })

    const childWrapper = wrapper.findComponent(Child)
    expect(childWrapper.text()).toEqual(results[0].id)
  })

  it('provides the query with the key `query`, only updating it if the status is success', async () => {
    const Child = defineComponent({
      name: 'Child',
      setup: () => ({ searchQuery: inject<Ref<string>>(QUERY_KEY as string) }),
      template: `<div>{{ searchQuery }}</div>`,
    })
    const { wrapper, commit } = await render({
      template: `<ResultsList><Child/></ResultsList>`,
      components: { Child },
    })

    const childWrapper = wrapper.findComponent(Child)

    // Initially, the query should be empty, because the request has not been made yet.
    expect(childWrapper.text()).toBeFalsy()

    commit('setQuery', 'tshirt')
    commit('setStatus', 'loading')
    await nextTick()

    // The injected query shouldn't change if the status is loading.
    expect(childWrapper.text()).toBeFalsy()

    commit('setStatus', 'success')
    await nextTick()

    // The query should have changed to `tshirt` because the request has succeeded.
    expect(childWrapper.text()).toEqual('tshirt')

    commit('setQuery', 'jacket')
    commit('setStatus', 'loading')
    await nextTick()

    // Here the injected query should be `tshirt` because the request for jacket is loading.
    expect(childWrapper.text()).toEqual('tshirt')

    commit('setStatus', 'success')
    await nextTick()

    // Finally, when the request for `jacket` has been completed, the injected query should be updated.
    expect(childWrapper.text()).toEqual('jacket')
  })

  it('provides a flag indicating if there are more results with the key `hasMoreItems`', async () => {
    const Child = defineComponent({
      name: 'Child',
      setup: () => ({ hasMoreItems: inject<Ref<boolean>>(HAS_MORE_ITEMS_KEY as string) }),
      template: `<div>{{ hasMoreItems }}</div>`,
    })

    const { commit, wrapper } = await render({
      template: `<ResultsList><Child /></ResultsList>`,
      components: { Child },
    })

    const childWrapper = wrapper.findComponent(Child)

    // Initially, the number of `items` and `totalResults` should match.
    expect(childWrapper.text()).toEqual('false')

    commit('setTotalResults', 1000)
    await nextTick()

    // Now the `totalResults` is higher than the number of `items`
    expect(childWrapper.text()).toEqual('true')
  })
})
