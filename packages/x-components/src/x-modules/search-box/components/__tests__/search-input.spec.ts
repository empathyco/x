import type { DeepPartial } from '@empathyco/x-utils'
import type { VueWrapper } from '@vue/test-utils'
import type { RootXStoreState } from '../../../../store/store.types'
import type { WireMetadata } from '../../../../wiring/wiring.types'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils'
import { XPlugin } from '../../../../plugins/index'
import { searchBoxXModule } from '../../x-module'
import SearchInput from '../search-input.vue'
import { resetXSearchBoxStateWith } from './utils'

function renderSearchInput({
  maxLength,
  instant,
  instantDebounceInMs,
  autofocus,
}: Partial<RenderSearchInputOptions> = {}): RenderSearchInputAPI {
  const store = new Store<DeepPartial<RootXStoreState>>({})

  const parent = document.createElement('div')
  document.body.appendChild(parent)

  const wrapper = mount(SearchInput, {
    /*
     * In order to make the autofocus test work after the jest 27 update, now is mandatory to
     * attach the element to some parent in the DOM, to emit the focus event.
     */
    attachTo: parent,
    store,
    props: { maxLength, instant, instantDebounceInMs, autofocus },
    global: {
      plugins: [store, installNewXPlugin({ store })],
    },
  })

  resetXSearchBoxStateWith(store)

  XPlugin.registerXModule(searchBoxXModule)
  const listener = jest.fn()

  return {
    wrapper,
    input: wrapper.find(getDataTestSelector('search-input')).element as HTMLInputElement,
    listener,
  }
}

describe('testing search input component', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('is an XComponent', () => {
    const { wrapper } = renderSearchInput()
    expect(isXComponent(wrapper.vm)).toEqual(true)
  })

  it('has SearchBox as XModule', () => {
    const { wrapper } = renderSearchInput()
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('searchBox')
  })

  it('emits UserHoveredInSearchBox when it is hovered in', async () => {
    const { wrapper, listener } = renderSearchInput()
    XPlugin.bus.on('UserHoveredInSearchBox').subscribe(listener)
    await wrapper.trigger('mouseenter')
    expect(listener).toHaveBeenCalled()
  })

  it('emits UserHoveredOutSearchBox when it is hovered out', async () => {
    const { wrapper, listener } = renderSearchInput()
    XPlugin.bus.on('UserHoveredOutSearchBox').subscribe(listener)
    await wrapper.trigger('mouseenter')
    await wrapper.trigger('mouseleave')
    expect(listener).toHaveBeenCalled()
  })

  it('emits UserFocusedSearchBox if input autofocus true', () => {
    const { listener } = renderSearchInput({ autofocus: true })
    XPlugin.bus.on('UserFocusedSearchBox').subscribe(listener)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(undefined)
  })

  it('does not emit UserFocusedSearchBox when mounting if autofocus is false', () => {
    const { listener } = renderSearchInput({ autofocus: false })
    XPlugin.bus.on('UserFocusedSearchBox').subscribe(listener)
    expect(listener).not.toHaveBeenCalled()
  })

  it('emits UserFocusedSearchBox when it gains the focus', async () => {
    const { listener, wrapper } = renderSearchInput()
    XPlugin.bus.on('UserFocusedSearchBox').subscribe(listener)
    await wrapper.trigger('focus')
    expect(listener).toHaveBeenCalled()
  })

  it('emits UserBlurredSearchBox when it loses the focus', async () => {
    const { listener, wrapper } = renderSearchInput()
    XPlugin.bus.on('UserBlurredSearchBox').subscribe(listener)

    await wrapper.trigger('focus')
    await wrapper.trigger('blur')

    expect(listener).toHaveBeenCalled()
  })

  it('emits UserIsTypingQuery when typing/pasting', async () => {
    const { input, listener, wrapper } = renderSearchInput()
    const queries = ['a', 'ab', 'abc']
    XPlugin.bus.on('UserIsTypingAQuery').subscribe(listener)

    for (const query of queries) {
      input.value = query
      await wrapper.trigger('input')
      expect(listener).toHaveBeenCalledWith(query)
    }

    expect(listener).toHaveBeenCalledTimes(3)
  })

  it(
    'emits UserAcceptedAQuery event when typing/pasting if config.instant is true and ' +
      'after the config.instantDebounceInMs timeout',
    async () => {
      const { input, listener, wrapper } = renderSearchInput()
      const query = 'pulpo'
      XPlugin.bus.on('UserAcceptedAQuery').subscribe(listener)

      await wrapper.setProps({ instant: true, instantDebounceInMs: 100 })

      input.value = query
      await wrapper.trigger('input')
      expect(listener).not.toHaveBeenCalledWith(query)

      jest.advanceTimersByTime(100)
      expect(listener).toHaveBeenCalledWith(query)
    },
  )

  it(
    'keeps the query empty after clearing it when config.instant is enabled and after the' +
      'config.instantDebounceInMs timeout',
    async () => {
      const { input, wrapper } = renderSearchInput()
      await wrapper.setProps({ instant: true, instantDebounceInMs: 100 })

      input.value = 'Antananarivo'
      await wrapper.trigger('input')

      jest.advanceTimersByTime(50)
      input.value = ''
      await wrapper.trigger('input')
      expect(input.value).toEqual('')

      jest.advanceTimersByTime(50)
      await nextTick()
      expect(input.value).toEqual('')
    },
  )

  it(
    'emits UserPressedEnterKey and UserAcceptedAQuery events when the query length is ' +
      'greater than zero and the user pressed the enter key',
    async () => {
      const { input, wrapper } = renderSearchInput()
      const enterListener = jest.fn()
      const acceptedQueryListener = jest.fn()
      const query = 'water'

      XPlugin.bus.on('UserPressedEnterKey', true).subscribe(enterListener)
      XPlugin.bus.on('UserAcceptedAQuery', true).subscribe(acceptedQueryListener)

      await wrapper.trigger('keydown.enter')
      expect(enterListener).not.toHaveBeenCalled()
      expect(acceptedQueryListener).not.toHaveBeenCalled()

      input.value = query
      await wrapper.trigger('keydown.enter')

      expect(enterListener).toHaveBeenCalledWith({
        eventPayload: query,
        metadata: expect.objectContaining<Partial<WireMetadata>>({
          feature: 'search_box',
        }),
      })
      expect(acceptedQueryListener).toHaveBeenCalledWith({
        eventPayload: query,
        metadata: expect.objectContaining<Partial<WireMetadata>>({
          feature: 'search_box',
        }),
      })
    },
  )

  it('focus the input when UserPressedClearSearchBoxButton event is emitted', async () => {
    const { input } = renderSearchInput()
    input.blur()
    expect(input).not.toBe(document.activeElement)
    await XPlugin.bus.emit('UserPressedClearSearchBoxButton', undefined)
    expect(input).toBe(document.activeElement)
  })
})

interface RenderSearchInputOptions {
  /** Maximum characters allowed in the input search. */
  maxLength: number
  /** Prop to enable autofocus when the search field is rendered. */
  autofocus: boolean
  /** Prop to enable the auto-accept query after debounce. */
  instant: boolean
  /** Debounce time for the instant prop.*/
  instantDebounceInMs: number
}

interface RenderSearchInputAPI {
  /** The wrapper of the rendered component. */
  wrapper: VueWrapper
  /** The input html element. */
  input: HTMLInputElement
  /** The mocked observed event. */
  listener: jest.Mock
}
