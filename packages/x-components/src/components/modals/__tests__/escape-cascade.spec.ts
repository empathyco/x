import type { DeepPartial } from '@empathyco/x-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { RootXStoreState } from '../../../store/store.types'
import { mount } from '@vue/test-utils'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { ariaProvide, getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils'
import { XPlugin } from '../../../plugins'
import Empathize from '../../../x-modules/empathize/components/empathize.vue'
import SearchInput from '../../../x-modules/search-box/components/search-input.vue'
import { searchBoxXModule } from '../../../x-modules/search-box/x-module'
import MainModal from '../main-modal.vue'

class MockResizeObserver implements ResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

window.ResizeObserver = MockResizeObserver as any

/**
 * Composes the actual product layout — MainModal containing a SearchInput and an Empathize with a
 * focusable suggestion — on a single X bus, to verify the Escape cascade end to end:
 * the first Escape in the input closes the empathize (predictive layer), a second Escape closes
 * the whole layer, and an Escape pressed inside the empathize closes it and returns the focus to
 * the search input without closing the layer.
 *
 * @returns An API to test the composed search layer.
 */
function renderSearchLayer(): RenderSearchLayerAPI {
  const store = new Store<DeepPartial<RootXStoreState>>({})
  const parent = document.createElement('div')
  document.body.appendChild(parent)

  const wrapper: VueWrapper = mount(
    {
      components: { MainModal, SearchInput, Empathize },
      template: `
        <MainModal>
          <SearchInput />
          <Empathize>
            <button data-test="suggestion-button">Suggestion</button>
          </Empathize>
        </MainModal>`,
    },
    {
      attachTo: parent,
      global: {
        plugins: [store, installNewXPlugin({ store })],
        provide: ariaProvide(),
      },
    },
  )

  XPlugin.registerXModule(searchBoxXModule)

  /** Opens the modal; the search input autofocuses and opens the empathize with it. */
  const openModal = async () => {
    await XPlugin.bus.emit('UserClickedOpenX', undefined)
    await nextTick() // modal content renders, the search input autofocuses
    vi.runAllTimers() // flushes the debounced open of the empathize
    await nextTick()
  }

  return {
    wrapper,
    openModal,
    getModalContent: () => wrapper.find(getDataTestSelector('modal-content')),
    getEmpathize: () => wrapper.find(getDataTestSelector('empathize')),
    getInput: () => wrapper.find(getDataTestSelector('search-input')).element as HTMLInputElement,
    getSuggestionButton: () =>
      wrapper.find(getDataTestSelector('suggestion-button')).element as HTMLButtonElement,
  } as const
}

describe('testing the Escape cascade of the search layer (MainModal + SearchInput + Empathize)', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('closes the empathize on the first Escape in the input and the whole layer on the second', async () => {
    const { wrapper, openModal, getModalContent, getEmpathize } = renderSearchLayer()
    const closeXListener = vi.fn()
    XPlugin.bus.on('UserClickedCloseX').subscribe(closeXListener)

    await openModal()
    expect(getModalContent().exists()).toBe(true)
    expect(getEmpathize().isVisible()).toBe(true)

    // First Escape: closes only the empathize; the keydown is consumed in the input, so the modal-level handler ignores it
    await wrapper.find(getDataTestSelector('search-input')).trigger('keydown', { key: 'Escape' })
    vi.runAllTimers()
    await nextTick()

    expect(getEmpathize().isVisible()).toBe(false)
    expect(getModalContent().exists()).toBe(true)
    expect(closeXListener).not.toHaveBeenCalled()

    // Second Escape: the empathize is closed, so the keydown reaches the modal and closes it
    await wrapper.find(getDataTestSelector('search-input')).trigger('keydown', { key: 'Escape' })
    vi.runAllTimers()
    await nextTick()

    expect(getModalContent().exists()).toBe(false)
    expect(closeXListener).toHaveBeenCalledTimes(1)
  })

  it('closes the empathize and refocuses the input on Escape from a suggestion, without closing the layer', async () => {
    const { wrapper, openModal, getModalContent, getEmpathize, getInput, getSuggestionButton } =
      renderSearchLayer()
    const closeXListener = vi.fn()
    XPlugin.bus.on('UserClickedCloseX').subscribe(closeXListener)

    await openModal()
    expect(getEmpathize().isVisible()).toBe(true)

    // Move the focus to a suggestion rendered inside the empathize
    getSuggestionButton().focus()
    await nextTick()

    await wrapper.find(getDataTestSelector('suggestion-button')).trigger('keydown', {
      key: 'Escape',
    })
    vi.runAllTimers()
    await nextTick()

    expect(getEmpathize().isVisible()).toBe(false)
    expect(getInput()).toBe(document.activeElement)
    expect(getModalContent().exists()).toBe(true)
    expect(closeXListener).not.toHaveBeenCalled()
  })
})

interface RenderSearchLayerAPI {
  /** The wrapper of the rendered search layer. */
  wrapper: VueWrapper
  /** Opens the modal; the search input autofocuses and opens the empathize with it. */
  openModal: () => Promise<void>
  /** Retrieves the modal content. */
  getModalContent: () => ReturnType<VueWrapper['find']>
  /** Retrieves the empathize root. */
  getEmpathize: () => ReturnType<VueWrapper['find']>
  /** Retrieves the search input element. */
  getInput: () => HTMLInputElement
  /** Retrieves the suggestion button element. */
  getSuggestionButton: () => HTMLButtonElement
}
