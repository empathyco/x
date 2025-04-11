import type { NextQuery, PreviewResults } from '@empathyco/x-types'
import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store/store.types'
import type { XEvent } from '../../../../wiring/events.types'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { createNextQueryStub, getResultsStub } from '../../../../__stubs__/index'
import {
  findTestDataById,
  getDataTestSelector,
  installNewXPlugin,
} from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils'
import { XPlugin } from '../../../../plugins/x-plugin'
import { nextQueriesXModule } from '../../x-module'
import NextQueryPreview from '../next-query-preview.vue'
import { resetXNextQueriesStateWith } from './utils'

describe('next query preview', () => {
  function renderNextQueryPreview({
    maxItemsToRender,
    suggestion = createNextQueryStub('milk'),
    template = `<NextQueryPreview :maxItemsToRender="maxItemsToRender" :suggestion="suggestion" />`,
    resultsPreview = {
      query: suggestion.query,
      items: getResultsStub(4),
      totalResults: 100,
    },
    eventToSpy,
  }: RenderNextQueryPreviewOptions = {}) {
    const store = new Store<DeepPartial<RootXStoreState>>({})

    const wrapper = mount(
      {
        props: ['maxItemsToRender', 'suggestion'],
        components: { NextQueryPreview },
        template,
      },
      {
        global: {
          plugins: [installNewXPlugin({ store, initialXModules: [nextQueriesXModule] })],
        },
        store,
        props: {
          maxItemsToRender,
          suggestion,
        },
      },
    )

    if (resultsPreview) {
      resetXNextQueriesStateWith(store, {
        resultsPreview: {
          [suggestion.query]: resultsPreview,
        },
      })
    }

    let eventSpy
    if (eventToSpy) {
      eventSpy = jest.fn()
      XPlugin.bus.on(eventToSpy).subscribe(eventSpy)
    }

    return {
      wrapper: wrapper.findComponent(NextQueryPreview),
      eventSpy,
      suggestion,
      resultsPreview,
      findTestDataById: findTestDataById.bind(undefined, wrapper),
    }
  }

  it('is an XComponent', () => {
    const { wrapper } = renderNextQueryPreview()
    expect(isXComponent(wrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(wrapper.vm)).toBe('nextQueries')
  })

  it('sends the next query preview mounted event', () => {
    const { eventSpy, suggestion } = renderNextQueryPreview({
      eventToSpy: 'NextQueryPreviewMountedHook',
    })
    expect(eventSpy).toHaveBeenCalledTimes(1)
    expect(eventSpy).toHaveBeenCalledWith(suggestion.query)
  })

  it('renders the results names in the default slot', async () => {
    const { resultsPreview, findTestDataById } = renderNextQueryPreview()
    await nextTick()
    const wrappers = findTestDataById('result-name')

    resultsPreview!.items.forEach((result, index) => {
      expect(wrappers.at(index)?.element).toHaveTextContent(result.name!)
    })
  })

  it('renders the specified number of items', async () => {
    const maxItemsToRender = 2
    const { findTestDataById } = renderNextQueryPreview({
      maxItemsToRender,
    })

    await nextTick()
    expect(findTestDataById('result-name')).toHaveLength(maxItemsToRender)
  })

  it('exposes the suggestion, the results and the totalResults in the default slot', async () => {
    const template = `
      <NextQueryPreview
          :suggestion="suggestion"
          #default="{ results, suggestion: slotSuggestion, totalResults}">
        <span data-test="next-query-query">{{slotSuggestion.query}}</span>
        <span data-test="total-results">{{ totalResults }}</span>
        <div v-for="result in results" :key="result.id">
          <span data-test="result-name">{{result.name}}</span>
        </div>
      </NextQueryPreview>`

    const { suggestion, wrapper, resultsPreview, findTestDataById } = renderNextQueryPreview({
      template,
    })

    await nextTick()

    expect(wrapper.find(getDataTestSelector('next-query-query')).element).toHaveTextContent(
      suggestion.query,
    )
    expect(wrapper.find(getDataTestSelector('total-results')).element).toHaveTextContent(
      resultsPreview!.totalResults.toString(),
    )

    const resultsWrappers = findTestDataById('result-name')

    resultsPreview!.items.forEach((result, index) => {
      expect(resultsWrappers.at(index)?.element).toHaveTextContent(result.name!)
    })
  })

  it('allows changing the result content', async () => {
    const template = `
      <NextQueryPreview :suggestion="suggestion" #result="{ result }">
        <span data-test="result-content">{{result.id}} - {{result.name}}</span>
      </NextQueryPreview>
    `
    const { findTestDataById, resultsPreview } = renderNextQueryPreview({ template })

    await nextTick()

    const resultsWrapper = findTestDataById('result-content')

    resultsPreview!.items.forEach((result, index) => {
      expect(resultsWrapper.at(index)?.element).toHaveTextContent(`${result.id} - ${result.name!}`)
    })
  })

  it('wont render if there are no results', () => {
    const { wrapper } = renderNextQueryPreview({
      resultsPreview: null,
    })
    expect(wrapper.find(getDataTestSelector('next-query-preview')).exists()).toBe(false)
  })
})

interface RenderNextQueryPreviewOptions {
  /** The maximum number of items to render. */
  maxItemsToRender?: number
  /** The initial next query to render. */
  suggestion?: NextQuery
  /**
   * An event to spy on.
   * This prop is convenient because the spy is created before mounting the component.
   */
  eventToSpy?: XEvent
  /** The results preview of the next query search request. */
  resultsPreview?: PreviewResults | null
  /**
   * The template to render. Receives `suggestion` via prop, and has registered the
   * {@link NextQueryPreview} component.
   */
  template?: string
}
