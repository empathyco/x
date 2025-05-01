import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store/store.types'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { createSemanticQuery } from '../../../../__stubs__/semantic-queries-stubs.factory'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils'
import { semanticQueriesXModule } from '../../x-module'
import SemanticQueries from '../semantic-queries.vue'
import { resetSemanticQueriesStateWith } from './utils'

function renderSemanticQueriesList({
  template = `<SemanticQueries v-bind="$attrs"/>`,
  semanticQueries = [
    createSemanticQuery({ query: 'test', distance: 1 }),
    createSemanticQuery({ query: 'test 2', distance: 2 }),
  ],
  threshold = 5,
  maxItemsToRender = 5,
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})
  const wrapper = mount(
    {
      template,
      components: { SemanticQueries },
    },
    {
      global: {
        plugins: [
          installNewXPlugin({
            store,
            initialXModules: [semanticQueriesXModule],
            xModules: {
              semanticQueries: { config: { threshold } },
            },
          }),
          store,
        ],
      },
      props: {
        maxItemsToRender,
      },
    },
  )
  resetSemanticQueriesStateWith(store, { semanticQueries })
  return { wrapper: wrapper.findComponent(SemanticQueries) } as const
}

describe('testing SemanticQueries', () => {
  it('is an X Component that belongs to the semantic queries module', () => {
    const { wrapper } = renderSemanticQueriesList()

    expect(isXComponent(wrapper.vm)).toBeTruthy()
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('semanticQueries')
  })

  it('wont render if there are no semantic queries', async () => {
    const { wrapper } = renderSemanticQueriesList({
      semanticQueries: [],
    })
    await nextTick()
    expect(wrapper.text()).toEqual('')
  })

  it('renders a list with the semantic queries from the state', async () => {
    const { wrapper } = renderSemanticQueriesList({
      semanticQueries: [
        createSemanticQuery({ query: 'test 1' }),
        createSemanticQuery({ query: 'test 2' }),
      ],
    })
    await nextTick()
    const wrappers = wrapper.findAll(getDataTestSelector('semantic-query'))

    expect(wrappers).toHaveLength(2)
    expect(wrappers.at(0)?.text()).toEqual('test 1')
    expect(wrappers.at(1)?.text()).toEqual('test 2')
  })

  it('renders up to the maxItemsToRender prop', async () => {
    const { wrapper } = renderSemanticQueriesList({
      semanticQueries: [
        createSemanticQuery({ query: 'test 1' }),
        createSemanticQuery({ query: 'test 2' }),
        createSemanticQuery({ query: 'test 3' }),
      ],
      maxItemsToRender: 2,
    })
    await nextTick()
    const wrappers = wrapper.findAll(getDataTestSelector('semantic-query'))

    expect(wrappers).toHaveLength(2)
    expect(wrappers.at(0)?.text()).toEqual('test 1')
    expect(wrappers.at(1)?.text()).toEqual('test 2')
  })

  it('exposes a slot to overwrite the whole list', async () => {
    const { wrapper } = renderSemanticQueriesList({
      template: `
        <SemanticQueries #default="{ suggestions }">
          <div>
            <span
              v-for="{query, distance} in suggestions"
              :key="query"
              data-test="semantic-query">
              {{ query }} - {{ distance }}
            </span>
          </div>
        </SemanticQueries>`,
      semanticQueries: [
        createSemanticQuery({ query: 'test 1', distance: 1 }),
        createSemanticQuery({ query: 'test 2', distance: 1 }),
      ],
    })
    await nextTick()
    const wrappers = wrapper.findAll(getDataTestSelector('semantic-query'))

    expect(wrappers).toHaveLength(2)
    expect(wrappers.at(0)?.text()).toEqual('test 1 - 1')
    expect(wrappers.at(1)?.text()).toEqual('test 2 - 1')
  })

  it('exposes an array of queries and a method to find the semantic query in its default slot', async () => {
    const { wrapper } = renderSemanticQueriesList({
      template: `
        <SemanticQueries #default="{ queries, findSemanticQuery }">
          <div v-for="query in queries" :key="query">
            <span data-test="string-query">{{ query }}</span>
            <span data-test="model-query">{{ findSemanticQuery(query).modelName }}</span>
          </div>
        </SemanticQueries>
      `,
      semanticQueries: [createSemanticQuery({ query: 'test', distance: 2 })],
    })
    await nextTick()
    expect(wrapper.find(getDataTestSelector('string-query')).text()).toEqual('test')
    expect(wrapper.find(getDataTestSelector('model-query')).text()).toEqual('SemanticQuery')
  })

  it('exposes a slot to overwrite the suggestion', async () => {
    const { wrapper } = renderSemanticQueriesList({
      template: `
        <SemanticQueries #suggestion="{ suggestion }">
          <span data-test="semantic-query-item-content">
            {{ suggestion.query }} - {{ suggestion.distance }}
          </span>
        </SemanticQueries>`,
      semanticQueries: [
        createSemanticQuery({ query: 'test 1', distance: 1 }),
        createSemanticQuery({ query: 'test 2', distance: 2 }),
      ],
    })
    await nextTick()
    const wrappers = wrapper.findAll(getDataTestSelector('semantic-query-item-content'))

    expect(wrappers).toHaveLength(2)
    expect(wrappers.at(0)?.text()).toEqual('test 1 - 1')
    expect(wrappers.at(1)?.text()).toEqual('test 2 - 2')
  })

  it('exposes a slot to overwrite the suggestion content', async () => {
    const { wrapper } = renderSemanticQueriesList({
      template: `
        <SemanticQueries #suggestion-content="{ suggestion }">
          <span data-test="semantic-query-item-content">
            {{ suggestion.query }} - {{ suggestion.distance }}
          </span>
        </SemanticQueries>`,
      semanticQueries: [
        createSemanticQuery({ query: 'test 1', distance: 1 }),
        createSemanticQuery({ query: 'test 2', distance: 2 }),
      ],
    })
    await nextTick()
    const wrappers = wrapper.findAll(getDataTestSelector('semantic-query-item-content'))

    expect(wrappers).toHaveLength(2)
    expect(wrappers.at(0)?.text()).toEqual('test 1 - 1')
    expect(wrappers.at(1)?.text()).toEqual('test 2 - 2')
  })
})
