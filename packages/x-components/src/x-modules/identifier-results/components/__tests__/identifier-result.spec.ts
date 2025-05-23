import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store/store.types'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createStore } from 'vuex'
import { createResultStub } from '../../../../__stubs__/results-stubs.factory'
import { XDummyBus } from '../../../../__tests__/bus.dummy'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils'
import { IdentifierResult } from '../index'
import { resetStoreIdentifierResultState } from './utils'

describe('testing IdentifierResult component', () => {
  const result = createResultStub('a022/3234')

  const store = createStore<DeepPartial<RootXStoreState>>({})
  const bus = new XDummyBus()
  const identifierResultWrapper = mount(IdentifierResult, {
    global: {
      plugins: [installNewXPlugin({ store }, bus)],
    },
    props: {
      result,
    },
  })

  it('is an XComponent and has an XModule', () => {
    expect(isXComponent(identifierResultWrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(identifierResultWrapper.vm)).toBe('identifierResults')
  })

  it('highlights the part of the identifier that matches the query', async () => {
    resetStoreIdentifierResultState(store, { query: 'A02232' })
    await nextTick()

    expect(getIdentifierResultSpanHtml()).toEqual(
      '<span class="x-identifier-result__matching-part">a022/32</span>34',
    )
  })

  it('highlights the part of the identifier that matches the query in different case', async () => {
    resetStoreIdentifierResultState(store, { query: 'a02232' })
    await nextTick()

    expect(getIdentifierResultSpanHtml()).toEqual(
      '<span class="x-identifier-result__matching-part">a022/32</span>34',
    )
  })

  it("doesn't render the identifier when there's no query", async () => {
    resetStoreIdentifierResultState(store, { query: '' })
    await nextTick()

    expect(identifierResultWrapper.text()).toEqual('')
  })

  it('highlights the part of the identifier  that matches the query with optional character', async () => {
    resetStoreIdentifierResultState(store, { query: 'a022/32' })
    await nextTick()

    expect(getIdentifierResultSpanHtml()).toEqual(
      '<span class="x-identifier-result__matching-part">a022/32</span>34',
    )
  })

  it('highlights the part of the identifier that matches the query ignoring whitespaces', async () => {
    resetStoreIdentifierResultState(store, { query: 'A 0 22 /3 2' })
    await nextTick()

    expect(getIdentifierResultSpanHtml()).toEqual(
      '<span class="x-identifier-result__matching-part">a022/32</span>34',
    )
  })

  it('highlights the part of the identifier that matches the query ignoring extra separators', async () => {
    resetStoreIdentifierResultState(store, { query: 'A/0/22/32' })
    await nextTick()

    expect(getIdentifierResultSpanHtml()).toEqual(
      '<span class="x-identifier-result__matching-part">a022/32</span>34',
    )
  })

  it("doesn't highlight if there is no match with the input query", async () => {
    resetStoreIdentifierResultState(store, { query: 'B022/32' })
    await nextTick()

    expect(getIdentifierResultSpanHtml()).toEqual('a022/3234')
  })

  function getIdentifierResultSpanHtml(): string {
    return identifierResultWrapper.find(getDataTestSelector('identifier-result')).element.innerHTML
  }
})
