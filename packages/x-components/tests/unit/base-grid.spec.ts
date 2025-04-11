import type { VNode } from 'vue'
import type { ListItem } from '../../src/utils/types'
import type { NextQueriesGroup } from '../../src/x-modules/next-queries/types'
import { h, onBeforeMount } from 'vue'
import { getNextQueriesStub } from '../../src/__stubs__/next-queries-stubs.factory'
import { getSearchResponseStub } from '../../src/__stubs__/search-response-stubs.factory'
import BaseGrid from '../../src/components/base-grid.vue'
import { XPlugin } from '../../src/plugins/x-plugin'
import { loadCss } from './css.utils'

interface Item {
  item: ListItem
}
const searchResponse = getSearchResponseStub()
const defaultItems = [
  ...searchResponse.banners!,
  ...searchResponse.promoteds!,
  ...searchResponse.results,
  {
    modelName: 'NextQueriesGroup',
    nextQueries: getNextQueriesStub(),
  } as NextQueriesGroup,
]

function render({
  columns = 3,
  items = defaultItems,
  itemSlots = {
    banner: ({ item }: Item) => h('p', { 'data-test': 'banner-slot' }, item.modelName),
    result: ({ item }: Item) => h('p', { 'data-test': 'result-slot' }, item.modelName),
  } as Record<string, (...args: any) => VNode>,
} = {}) {
  const renderedColumnsNumberChangedSpy = cy.spy()
  loadCss(':root { --x-size-min-width-grid-item: 300px; }')

  cy.mount({
    setup: () => {
      onBeforeMount(() => {
        XPlugin.bus.on('RenderedColumnsNumberChanged').subscribe(renderedColumnsNumberChangedSpy)
      })
      return () =>
        h(
          BaseGrid,
          { items, columns },
          {
            default: ({ item }: { item: ListItem }) =>
              h('p', { 'data-test': 'default-slot' }, item.modelName),
            ...itemSlots,
          },
        )
    },
  })

  return {
    getBaseGrid: () => cy.getByDataTest('grid'),
    getDefaultSlot: () => cy.getByDataTest('default-slot'),
    getScopedSlot: (modelName: string) => cy.getByDataTest(`${modelName}-slot`),
    renderedColumnsNumberChangedSpy: () => cy.wrap(renderedColumnsNumberChangedSpy),
  }
}

describe('testing BaseGrid', () => {
  it('allows configuring the number of columns and updates the css class accordingly', () => {
    const { getBaseGrid } = render({ columns: 5 })

    getBaseGrid().should('have.class', 'x-base-grid--cols-5')
  })

  it('allows customizing the default slot', () => {
    render()

    cy.getByDataTest('default-slot').should('exist')
  })

  it('allows customizing named slots', () => {
    const { getDefaultSlot, getScopedSlot } = render()

    getDefaultSlot().should('exist')
    getScopedSlot('result').should('exist')
    getScopedSlot('banner').should('exist')
  })

  it('allows customizing named slots only using kebab case', () => {
    const { getScopedSlot } = render({
      itemSlots: {
        banner: ({ item }: Item) => h('p', { 'data-test': 'banner-slot' }, item.modelName),
        NextQueriesGroup: ({ item }: Item) =>
          h('p', { 'data-test': 'NextQueriesGroup-slot' }, item.modelName),
        'next-queries-group': ({ item }: Item) =>
          h('p', { 'data-test': 'next-queries-group-slot' }, item.modelName),
      },
    })

    getScopedSlot('banner').should('exist')
    getScopedSlot('NextQueriesGroup').should('not.exist')
    getScopedSlot('next-queries-group').should('exist')
  })

  it('emits RenderedColumnsNumberChanged event when rendered columns number changes', () => {
    const { renderedColumnsNumberChangedSpy } = render({ columns: 0 })

    renderedColumnsNumberChangedSpy().should('have.been.calledWith', 6)
    cy.viewport(1000, 200)
    renderedColumnsNumberChangedSpy().should('have.been.calledWith', 3)
    renderedColumnsNumberChangedSpy().should('have.been.calledTwice')
  })
})
