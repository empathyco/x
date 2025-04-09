import type { HistoryQuery } from '@empathyco/x-types'
import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store/store.types'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import {
  createHistoryQueries,
  createHistoryQuery,
} from '../../../../__stubs__/history-queries-stubs.factory'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils'
import { historyQueriesXModule } from '../../x-module'
import HistoryQueries from '../history-queries.vue'
import { resetXHistoryQueriesStateWith } from './utils'

function renderHistoryQueries({
  historyQueries = createHistoryQueries('chocolate', 'milk chocolate', 'chocolate milk'),
  maxItemsToRender,
  template = '<HistoryQueries v-bind="$attrs" />',
}: RenderHistoryQueriesOptions = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})
  const wrapper = mount(
    {
      template,
      inheritAttrs: false,
      components: {
        HistoryQueries,
      },
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [historyQueriesXModule] })],
      },
      props: {
        maxItemsToRender,
      },
      store,
    },
  )

  resetXHistoryQueriesStateWith(store, { historyQueries })

  return {
    wrapper: wrapper.findComponent(HistoryQueries),
    historyQueries,
    async setMaxItemsToRender(max: number) {
      // @ts-expect-error - TS error.
      return wrapper.setProps({ maxItemsToRender: max })
    },
    getSuggestionItemWrappers() {
      return wrapper.findAll(getDataTestSelector('suggestion-item'))
    },
  }
}

describe('testing Query Suggestions component', () => {
  it('is an XComponent that belongs to the history queries module', () => {
    const { wrapper } = renderHistoryQueries()
    expect(isXComponent(wrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('historyQueries')
  })

  it('does not render anything when suggestions are empty', () => {
    const { wrapper } = renderHistoryQueries({ historyQueries: [] })
    expect(wrapper.find('x-history-queries').exists()).toBe(false)
  })

  it('renders the state list of suggestions', async () => {
    const { getSuggestionItemWrappers, historyQueries } = renderHistoryQueries({
      historyQueries: createHistoryQueries('chocolate', 'milk chocolate'),
    })

    await nextTick()

    const suggestionItemWrappers = getSuggestionItemWrappers()
    expect(suggestionItemWrappers).toHaveLength(2)
    suggestionItemWrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(`${historyQueries[index].query}✕`)
    })
  })

  it('allows to render a custom query suggestion', async () => {
    const { getSuggestionItemWrappers, historyQueries } = renderHistoryQueries({
      historyQueries: createHistoryQueries('chocolate', 'milk chocolate'),
      template: `
        <HistoryQueries #suggestion="{ suggestion }">
          <button class="custom-suggestion">
            <span>🔍</span>
            <span>{{ suggestion.query }}</span>
          </button>
        </HistoryQueries>
      `,
    })

    await nextTick()

    const suggestionItemWrappers = getSuggestionItemWrappers()
    expect(suggestionItemWrappers).toHaveLength(2)
    suggestionItemWrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.get('.custom-suggestion').text()).toEqual(
        `🔍${historyQueries[index].query}`,
      )
      expect(itemWrapper.find(getDataTestSelector('history-query')).exists()).toBe(false)
    })
  })

  it('allows to render a custom suggestion content', async () => {
    const { getSuggestionItemWrappers, historyQueries } = renderHistoryQueries({
      historyQueries: createHistoryQueries('chocolate', 'milk chocolate'),
      template: `
        <HistoryQueries #suggestion-content="{ suggestion }">
          <span>🔍</span>
          <span>{{ suggestion.query }}</span>
        </HistoryQueries>
      `,
    })

    await nextTick()

    const suggestionItemWrappers = getSuggestionItemWrappers()
    expect(suggestionItemWrappers).toHaveLength(2)
    suggestionItemWrappers.forEach((itemWrapper, index) => {
      expect(itemWrapper.text()).toEqual(`🔍${historyQueries[index].query}✕`)
      expect(itemWrapper.find(getDataTestSelector('history-query')).exists()).toBe(true)
    })
  })

  it('allows to render a custom remove suggestion content', async () => {
    const { getSuggestionItemWrappers, historyQueries } = renderHistoryQueries({
      historyQueries: createHistoryQueries('chocolate', 'milk chocolate'),
      template: `
        <HistoryQueries #suggestion-remove-content="{ suggestion }">
          <span>❌</span>
          <span>{{ suggestion.query }}</span>
        </HistoryQueries>
      `,
    })

    await nextTick()

    const suggestionItemWrappers = getSuggestionItemWrappers()
    expect(suggestionItemWrappers).toHaveLength(2)
    suggestionItemWrappers.forEach((itemWrapper, index) => {
      const query = historyQueries[index].query
      expect(itemWrapper.text()).toEqual(`${query}❌${query}`)
      expect(itemWrapper.find(getDataTestSelector('history-query')).exists()).toBe(true)
    })
  })

  it('renders at most the number of HistoryQuery defined by `maxItemsToRender` prop', async () => {
    const { getSuggestionItemWrappers, setMaxItemsToRender, historyQueries } = renderHistoryQueries(
      {
        historyQueries: createHistoryQueries('shirt', 'jeans', 'tshirt', 'jumper'),
      },
    )

    await setMaxItemsToRender(historyQueries.length - 1)
    expect(getSuggestionItemWrappers()).toHaveLength(historyQueries.length - 1)

    await setMaxItemsToRender(historyQueries.length)
    expect(getSuggestionItemWrappers()).toHaveLength(historyQueries.length)

    await setMaxItemsToRender(historyQueries.length + 1)
    expect(getSuggestionItemWrappers()).toHaveLength(historyQueries.length)
  })

  it('renders only history queries with results', async () => {
    const { getSuggestionItemWrappers } = renderHistoryQueries({
      historyQueries: [
        createHistoryQuery({ query: 'cachelos' }),
        createHistoryQuery({ query: 'zorza', totalResults: 0 }),
        createHistoryQuery({ query: 'licor cafe', totalResults: 20 }),
      ],
    })

    await nextTick()
    expect(getSuggestionItemWrappers()).toHaveLength(2)
    expect(getSuggestionItemWrappers().at(0)?.text()).toEqual('cachelos✕')
    expect(getSuggestionItemWrappers().at(1)?.text()).toEqual('licor cafe✕')
  })
})

interface RenderHistoryQueriesOptions {
  /** The suggestions list to render. */
  historyQueries?: HistoryQuery[]
  /** The maximum number of items to render. */
  maxItemsToRender?: number
  /** The template to render. */
  template?: string
}
