import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store'
import type { AriaLabels } from '../../../../types'
import type { WireMetadata } from '../../../../wiring'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, reactive } from 'vue'
import { Store } from 'vuex'
import { createHistoryQuery } from '../../../../__stubs__'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components'
import { XPlugin } from '../../../../plugins/index'
import { mergeAccesibilityLabels } from '../../../../utils'
import { historyQueriesXModule } from '../../x-module'
import HistoryQuery from '../history-query.vue'
import { resetXHistoryQueriesStateWith } from './utils'

/**
 * Builds the `accesibility` injection with the given overrides merged onto the default labels.
 */
function ariaProvide(overrides: AriaLabels = {}): { accesibility: AriaLabels } {
  return { accesibility: reactive(mergeAccesibilityLabels(overrides)) }
}

function renderHistoryQuery({
  suggestion = createHistoryQuery({ query: 'milk' }),
  query = '',
  template = '<HistoryQuery v-bind="$attrs"/>',
  removeButtonClass = '',
  suggestionClass = '',
  wrapperComponentOptions = {},
  ariaLabels,
}: Partial<{
  suggestion?: ReturnType<typeof createHistoryQuery>
  query?: string
  template?: string
  removeButtonClass?: string
  suggestionClass?: string
  wrapperComponentOptions?: Record<string, any>
  ariaLabels?: AriaLabels
}> = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const wrapper = mount(
    {
      template,
      inheritAttrs: false,
      components: { HistoryQuery },
      ...wrapperComponentOptions,
    },
    {
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [historyQueriesXModule] })],
        provide: ariaProvide(ariaLabels),
      },
      props: { suggestion, removeButtonClass, suggestionClass },
    },
  )

  resetXHistoryQueriesStateWith(store, { query })

  return {
    wrapper: wrapper.findComponent(HistoryQuery),
    suggestion,
    emitSpy: vi.spyOn(XPlugin.bus, 'emit'),
    getSuggestionWrapper: () => wrapper.get(getDataTestSelector('history-query')),
    getRemoveWrapper: () => wrapper.get(getDataTestSelector('remove-history-query')),
    getMatchingPart: () => wrapper.get(getDataTestSelector('matching-part')),
  }
}

describe('testing history-query component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('is an XComponent that belongs to the history queries', () => {
    const { wrapper } = renderHistoryQuery()

    expect(isXComponent(wrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('historyQueries')
  })

  it('renders the suggestion received as prop', () => {
    const { getSuggestionWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'milk' }),
    })

    expect(getSuggestionWrapper().text()).toEqual('milk')
  })

  it('renders the remove button with the default accessible label', () => {
    const { getRemoveWrapper } = renderHistoryQuery()

    expect(getRemoveWrapper().attributes('aria-label')).toBe('Remove')
  })

  it('resolves the remove button aria-label from the global configuration', () => {
    const { getRemoveWrapper } = renderHistoryQuery({
      ariaLabels: { HistoryQuery: { removeButton: 'Eliminar' } },
    })

    expect(getRemoveWrapper().attributes('aria-label')).toBe('Eliminar')
  })

  it('highlights the suggestion matching parts with the state query', async () => {
    const { getSuggestionWrapper, getMatchingPart } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'baileys' }),
      query: 'Bá',
    })

    await nextTick()

    expect(getMatchingPart().text()).toEqual('ba')
    expect(getSuggestionWrapper().text()).toEqual('baileys')
  })

  it('emits appropriate events on click', async () => {
    const { emitSpy, getSuggestionWrapper, suggestion } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'milk' }),
    })

    await getSuggestionWrapper().trigger('click')

    const expectedMetadata = expect.objectContaining<Partial<WireMetadata>>({
      moduleName: 'historyQueries',
      target: getSuggestionWrapper().element as HTMLElement,
      feature: 'history_query',
    })
    expect(emitSpy).toHaveBeenCalledWith('UserAcceptedAQuery', suggestion.query, expectedMetadata)
    expect(emitSpy).toHaveBeenCalledWith('UserSelectedASuggestion', suggestion, expectedMetadata)
    expect(emitSpy).toHaveBeenCalledWith('UserSelectedAHistoryQuery', suggestion, expectedMetadata)
  })

  it('allows to customise the rendered content', () => {
    const { getSuggestionWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'baileys' }),
      template: `
        <HistoryQuery v-bind="$attrs" #default="{ suggestion }">
          <span>🔍</span>
          <span>{{ suggestion.query }}</span>
        </HistoryQuery>`,
    })

    expect(getSuggestionWrapper().text()).toEqual('🔍baileys')
  })

  it('emits `UserPressedRemoveHistoryQuery` when `RemoveHistoryQuery` button is clicked', () => {
    const { emitSpy, suggestion, getRemoveWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'milk' }),
    })

    void getRemoveWrapper().trigger('click')

    expect(emitSpy).toHaveBeenCalledTimes(1)
    expect(emitSpy).toHaveBeenCalledWith(
      'UserPressedRemoveHistoryQuery',
      suggestion,
      expect.objectContaining<Partial<WireMetadata>>({
        moduleName: 'historyQueries',
        target: getRemoveWrapper().element as HTMLElement,
      }),
    )
  })

  it('allows to customize `RemoveHistoryQuery` button content', () => {
    const { getRemoveWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'cruzcampo' }),
      template: `
        <HistoryQuery v-bind="$attrs" #remove-button-content="{ suggestion }">
          Remove {{ suggestion.query }} ❌
        </HistoryQuery>`,
    })

    expect(getRemoveWrapper().text()).toBe('Remove cruzcampo ❌')
  })

  it('allows to add classes to the `RemoveHistoryQuery` button', () => {
    const { getRemoveWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'baileys' }),
      query: 'Bá',
      removeButtonClass: 'custom-class',
    })

    expect(getRemoveWrapper().classes('custom-class')).toBe(true)
  })

  it('allows to add classes to the `HistoryQuerySuggestion` button', () => {
    const { getSuggestionWrapper } = renderHistoryQuery({
      suggestion: createHistoryQuery({ query: 'baileys' }),
      query: 'Bá',
      suggestionClass: 'custom-class',
    })

    expect(getSuggestionWrapper().classes('custom-class')).toBe(true)
  })

  it('emits click event', async () => {
    const suggestion = createHistoryQuery({ query: 'baileys' })
    const handleClick = vi.fn()

    const { wrapper } = renderHistoryQuery({
      suggestion,
      template: `<HistoryQuery v-bind="$attrs" @click="handleClick"/>`,
      wrapperComponentOptions: { methods: { handleClick } },
    })

    await wrapper.get(getDataTestSelector('history-query')).trigger('click')

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith(suggestion, expect.any(MouseEvent))
  })
})
