import type { HistoryQuery } from '@empathyco/x-types'
import type { DeepPartial } from '@empathyco/x-utils'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import type { RootXStoreState } from '../../../../store/store.types'
import type { SnippetConfig } from '../../../../x-installer/api/api.types'
import { forEach } from '@empathyco/x-utils'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import {
  createHistoryQueries,
  createHistoryQuery,
} from '../../../../__stubs__/history-queries-stubs.factory'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils'
import { XPlugin } from '../../../../plugins/x-plugin'
import { baseSnippetConfig } from '../../../../views/base-config'
import { historyQueriesXModule } from '../../x-module'
import HistoryQueryComponent from '../history-query.vue'
import MyHistory from '../my-history.vue'
import { resetXHistoryQueriesStateWith } from './utils'

const historyQueries: HistoryQuery[] = [
  {
    query: 'lego',
    timestamp: 1650286901802,
    modelName: 'HistoryQuery',
  },
  {
    query: 'barbie',
    timestamp: 1650286895254,
    modelName: 'HistoryQuery',
  },
  {
    query: 'truck',
    timestamp: 1649230515242,
    modelName: 'HistoryQuery',
  },
  {
    query: 'doll',
    timestamp: 1649230513535,
    modelName: 'HistoryQuery',
  },
]

function renderMyHistory({
  template = '<MyHistory :locale="locale" :queriesListClass="queriesListClass" />',
  historyQueries = [],
  locale,
  snippetConfig,
  queriesListClass,
}: MyHistoryOptions = {}): MyHistoryAPI {
  const store = new Store<DeepPartial<RootXStoreState>>({})
  const wrapper = mount(
    {
      template,
      components: {
        MyHistory,
        HistoryQuery: HistoryQueryComponent,
      },
      provide: {
        snippetConfig,
      },
      props: ['locale', 'queriesListClass'],
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [historyQueriesXModule] })],
      },
      store,
      props: {
        locale,
        queriesListClass,
      },
    },
  )

  resetXHistoryQueriesStateWith(store, { historyQueries })
  return {
    wrapper: wrapper.findComponent(MyHistory),
    async search(query) {
      await XPlugin.bus.emit('UserAcceptedAQuery', query)
      return nextTick()
    },
    getListItems() {
      return wrapper.findAll(getDataTestSelector('suggestion-item'))
    },
    findAllInWrapper(selector) {
      return wrapper.findAll(getDataTestSelector(selector))
    },
  }
}

describe('testing MyHistory component', () => {
  it('is an XComponent which has an XModule', () => {
    const { wrapper } = renderMyHistory()
    expect(isXComponent(wrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('historyQueries')
  })

  it('does not render the component if history is empty', () => {
    const { wrapper } = renderMyHistory()
    expect(wrapper.find('x-my-history').exists()).toBe(false)
  })

  it('renders the list of searched queries group by date', async () => {
    const historyQueriesGroupedByDate = {
      'Monday, April 18, 2022': [historyQueries[0], historyQueries[1]],
      'Wednesday, April 6, 2022': [historyQueries[2], historyQueries[3]],
    }
    const { findAllInWrapper } = renderMyHistory({
      historyQueries,
      snippetConfig: { ...baseSnippetConfig, lang: 'en' },
    })

    await nextTick()
    expectValidHistoryContent(historyQueriesGroupedByDate, findAllInWrapper, 'en')
  })

  it('renders the date using the locale prop when there is no snippetConfig', async () => {
    const historyQueriesGroupedByDate = {
      'Lunes, 18 de abril de 2022': [historyQueries[0], historyQueries[1]],
      'Miércoles, 6 de abril de 2022': [historyQueries[2], historyQueries[3]],
    }
    const locale = 'es'
    const { findAllInWrapper } = renderMyHistory({
      historyQueries,
      locale,
    })

    await nextTick()
    expectValidHistoryContent(historyQueriesGroupedByDate, findAllInWrapper, locale)
  })

  it('allows changing history query content and render the list of history queries', async () => {
    const historyQueries = createHistoryQueries(
      'moura',
      'calamares',
      'rubia galega',
      'pulpo',
      'cachelos',
      'navajas',
      'croquetas',
      'zamburiñas',
    )

    const { findAllInWrapper } = renderMyHistory({
      template: `
          <MyHistory>
            <template #suggestion-content="{suggestion, index}">
              <img src="./history-icon.svg" data-test="suggestion-history-icon"/>
              <span :data-index="index"
                    data-test="suggestion-content-slot"
                    v-html="suggestion.query"></span>
            </template>
            <template #suggestion-remove-content>
              <img src="./remove-icon.svg" data-test="suggestion-remove-icon"/>
            </template>
          </MyHistory>
        `,
      historyQueries,
    })

    await nextTick()

    const suggestionIconWrappers = findAllInWrapper('suggestion-history-icon')
    const suggestionRemoveIconWrappers = findAllInWrapper('suggestion-remove-icon')
    const suggestionContentWrappers = findAllInWrapper('suggestion-content-slot')

    expect(suggestionIconWrappers).toHaveLength(historyQueries.length)
    expect(suggestionRemoveIconWrappers).toHaveLength(historyQueries.length)
    expect(suggestionContentWrappers).toHaveLength(historyQueries.length)
    suggestionContentWrappers.forEach((contentWrapper, index) => {
      expect(contentWrapper.attributes('data-index')).toEqual(index.toString())
      expect(contentWrapper.text()).toEqual(historyQueries[index].query)
    })
  })

  it('allows changing the history query', async () => {
    const historyQuery = createHistoryQuery({
      query: 'testQuery',
      timestamp: Date.parse('2023-01-23T09:40:00'),
    })

    const { wrapper } = renderMyHistory({
      template: `
        <MyHistory>
            <template #suggestion="{ suggestion, formatTime}">
                <HistoryQuery :suggestion="suggestion">
                    <span data-test="suggestion-query">{{ suggestion.query }}</span>
                    <span data-test="suggestion-date">{{ formatTime(suggestion.timestamp) }}</span>
                </HistoryQuery>
            </template>
        </MyHistory>
      `,
      historyQueries: [historyQuery],
    })

    await nextTick()

    expect(wrapper.get(getDataTestSelector('suggestion-query')).text()).toBe('testQuery')
    expect(wrapper.get(getDataTestSelector('suggestion-date')).text().replace(/\s/g, '')).toEqual(
      '09:40AM',
    )
  })

  it('allows to add classes to the queries list', async () => {
    const { wrapper } = renderMyHistory({
      historyQueries,
      queriesListClass: 'custom-class',
    })
    await nextTick()
    expect(wrapper.find(getDataTestSelector('my-history-queries')).classes('custom-class')).toBe(
      true,
    )
  })

  it('should use uiLang from snippetConfig for date formatting', async () => {
    const historyQueriesGroupedByDate = {
      'Lunes, 18 de abril de 2022': [historyQueries[0], historyQueries[1]],
      'Miércoles, 6 de abril de 2022': [historyQueries[2], historyQueries[3]],
    }
    const { findAllInWrapper } = renderMyHistory({
      historyQueries,
      snippetConfig: { ...baseSnippetConfig, lang: 'en', uiLang: 'es' },
    })

    await nextTick()
    expectValidHistoryContent(historyQueriesGroupedByDate, findAllInWrapper, 'es')
  })

  it('should capitalize the first character of formatted dates', async () => {
    const { findAllInWrapper } = renderMyHistory({
      historyQueries,
      snippetConfig: { ...baseSnippetConfig, lang: 'es', uiLang: 'es' },
    })

    await nextTick()
    const historyWrappers = findAllInWrapper('my-history-item')
    historyWrappers.forEach(wrapper => {
      const dateText = wrapper.find(getDataTestSelector('my-history-date')).text()
      // Check first character is uppercase
      expect(dateText.charAt(0)).toBe(dateText.charAt(0).toUpperCase())
    })
  })

  it('should fallback to lang when uiLang is not provided', async () => {
    const historyQueriesGroupedByDate = {
      'Lunes, 18 de abril de 2022': [historyQueries[0], historyQueries[1]],
      'Miércoles, 6 de abril de 2022': [historyQueries[2], historyQueries[3]],
    }
    const { findAllInWrapper } = renderMyHistory({
      historyQueries,
      snippetConfig: { ...baseSnippetConfig, lang: 'es' },
    })

    await nextTick()
    expectValidHistoryContent(historyQueriesGroupedByDate, findAllInWrapper, 'es')
  })

  function expectValidHistoryContent(
    historyQueriesGroupedByDate: Record<string, HistoryQuery[]>,
    findAllInWrapper: MyHistoryAPI['findAllInWrapper'],
    locale: [] | string = [],
  ): void {
    const historyWrappers = findAllInWrapper('my-history-item')
    forEach(historyQueriesGroupedByDate, (date, historyQueries, index) => {
      const groupWrapper = historyWrappers[index]
      const historyItemWrappers = groupWrapper?.findAll(getDataTestSelector('history-query-item'))
      expect(groupWrapper?.find(getDataTestSelector('my-history-date')).text()).toBe(date)
      historyQueries.forEach((historyQuery, historyQueryIndex) => {
        const hour = new Date(historyQuery.timestamp).toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit',
        })
        expect(historyItemWrappers?.at(historyQueryIndex)?.text()).toMatch(
          `${historyQuery.query} - ${hour}✕`,
        )
      })
    })
  }
})

/**
 * The options for the `renderMyHistory` function.
 */
interface MyHistoryOptions {
  /** The template to render.*/
  template?: string
  /** List of {@link HistoryQuery} that are going to be rendered. */
  historyQueries?: HistoryQuery[]
  /** The locale to format the date.*/
  locale?: string
  /** The provided {@link SnippetConfig}.*/
  snippetConfig?: SnippetConfig
  /** Class to add to the queries list. */
  queriesListClass?: string
}

/**
 * Test API for the {@link MyHistory} component.
 */
interface MyHistoryAPI {
  /** The wrapper for my history component. */
  wrapper: VueWrapper
  /** Helper method to search a query. */
  search: (query: string) => Promise<void>
  /**
   * Retrieves the wrapper for the items of the list rendered by the {@link MyHistory}
   * component.
   */
  getListItems: () => any[]
  /** Retrieves the wrapper for the items that matches with the selector. */
  findAllInWrapper: (selector: string) => DOMWrapper<Element>[]
}
