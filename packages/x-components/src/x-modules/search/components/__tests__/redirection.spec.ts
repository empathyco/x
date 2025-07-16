import type { Redirection as RedirectionModel } from '@empathyco/x-types'
import type { DeepPartial } from '@empathyco/x-utils'
import type { RootXStoreState } from '../../../../store'
import type { WirePayload } from '../../../../wiring'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { Store } from 'vuex'
import { createRedirectionStub, getEmptySearchResponseStub } from '../../../../__stubs__'
import { XComponentsAdapterDummy } from '../../../../__tests__/adapter.dummy'
import { XDummyBus } from '../../../../__tests__/bus.dummy'
import { getDataTestSelector, installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components'
import { XPlugin } from '../../../../plugins'
import { searchXModule } from '../../x-module'
import Redirection from '../redirection.vue'
import { resetXSearchStateWith } from './utils'

const stubRedirections = [createRedirectionStub('redirection')]
let bus = new XDummyBus()
function renderRedirection({
  template = `
  <Redirection
    :mode="mode"
    :delayInSeconds="delayInSeconds"
    v-slot="{ redirection, redirect, abortRedirect }">
     <span data-test="redirection-url">{{ redirection.url }}</span>
     <button data-test="redirection-accept" @click="redirect">Redirect now!</button>
     <button data-test="redirection-abort" @click="abortRedirect">Abort redirection!</button>
  </Redirection>
`,
  redirections = stubRedirections,
  mode = 'auto',
  delayInSeconds = 1,
} = {}) {
  const store = new Store<DeepPartial<RootXStoreState>>({})
  ;(XComponentsAdapterDummy.search as jest.Mock).mockResolvedValueOnce({
    ...getEmptySearchResponseStub(),
  })

  const wrapper = mount(
    {
      components: { Redirection },
      template,
    },
    {
      data: () => ({ mode, delayInSeconds }),
      global: {
        plugins: [installNewXPlugin({ store, initialXModules: [searchXModule] }, bus)],
      },
    },
  )
  resetXSearchStateWith(store, { redirections })

  const onUserAbortedARedirection = jest.fn()
  XPlugin.bus.on('UserClickedAbortARedirection', true).subscribe(onUserAbortedARedirection)

  const onUserClickedARedirection = jest.fn()
  XPlugin.bus.on('UserClickedARedirection', true).subscribe(onUserClickedARedirection)

  return {
    wrapper: wrapper.findComponent(Redirection),
    acceptRedirection: async () => {
      await wrapper.find(getDataTestSelector('redirection-accept')).trigger('click')
    },
    abortRedirection: async () => {
      await wrapper.find(getDataTestSelector('redirection-abort')).trigger('click')
    },
    onUserClickedARedirection,
    onUserAbortedARedirection,
  }
}

describe('testing Redirection component', () => {
  const spy = jest.fn()
  const { location } = window

  beforeEach(() => {
    // @ts-expect-error - TS error
    delete window.location
    window.location = { ...location, replace: spy } as any
    bus = new XDummyBus()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    window.location = location as any
  })

  it('is an XComponent', () => {
    const { wrapper } = renderRedirection()
    expect(isXComponent(wrapper.vm)).toBe(true)
  })

  it('has Search as XModule', () => {
    const { wrapper } = renderRedirection()
    expect(getXComponentXModuleName(wrapper.vm)).toBe('search')
  })

  it("doesn't render when there are no redirections", () => {
    const { wrapper } = renderRedirection({ redirections: [] })

    expect(wrapper.find('.x-redirection').exists()).toBe(false)
  })

  it('renders the redirection component slot', async () => {
    const { wrapper } = renderRedirection({
      template: `
        <Redirection
        :mode="mode"
        :delayInSeconds="delayInSeconds"
        v-slot="{ redirection, redirect, abortRedirect }">
          <span data-test="redirection-url">{{ redirection.url }}</span>
        </Redirection>`,
    })

    await nextTick()

    expect(wrapper.get(getDataTestSelector('redirection-url')).text()).toBe(stubRedirections[0].url)
  })

  it('redirects and emits the `UserClickedARedirection` event in manual mode when the user click the button', async () => {
    const { onUserClickedARedirection, acceptRedirection } = renderRedirection({ mode: 'manual' })

    await nextTick()
    await acceptRedirection()

    expect(onUserClickedARedirection).toHaveBeenCalledTimes(1)
    expect(onUserClickedARedirection).toHaveBeenCalledWith<[WirePayload<RedirectionModel>]>({
      eventPayload: stubRedirections[0],
      metadata: {
        moduleName: 'search',
        location: 'none',
        replaceable: true,
      },
    })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(stubRedirections[0].url)
  })

  it("doesn't redirect and doesn't emit the event `UserClickedARedirection` in manual when the user doesn't click the button", () => {
    const { onUserClickedARedirection } = renderRedirection({ mode: 'manual' })

    jest.runAllTicks()

    expect(onUserClickedARedirection).not.toHaveBeenCalled()
    expect(spy).not.toHaveBeenCalled()
  })

  it('redirects and emits the `UserClickedARedirection` event in auto mode and 0 seconds of delay', async () => {
    const { onUserClickedARedirection } = renderRedirection({ delayInSeconds: 0 })

    await nextTick()
    // The delay 0 runs so fast, we need to force the test to simulate a wait.
    jest.advanceTimersByTime(1)

    expect(onUserClickedARedirection).toHaveBeenCalledTimes(1)
    expect(onUserClickedARedirection).toHaveBeenCalledWith<[WirePayload<RedirectionModel>]>({
      eventPayload: stubRedirections[0],
      metadata: {
        moduleName: 'search',
        location: 'none',
        replaceable: true,
      },
    })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(stubRedirections[0].url)
  })

  it('emits the redirection event `UserClickedAbortARedirection`', async () => {
    const { onUserClickedARedirection, onUserAbortedARedirection, abortRedirection } =
      renderRedirection()

    await nextTick()
    await abortRedirection()
    jest.runAllTicks()

    expect(onUserClickedARedirection).not.toHaveBeenCalled()
    expect(onUserAbortedARedirection).toHaveBeenCalledTimes(1)
    expect(spy).not.toHaveBeenCalled()
  })

  it("doesn't redirect and doesn't emit the `UserClickedARedirection` event if there is a new query accepted", async () => {
    const { onUserClickedARedirection } = renderRedirection()
    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')

    jest.runAllTicks()

    expect(onUserClickedARedirection).not.toHaveBeenCalled()
    expect(spy).not.toHaveBeenCalled()
  })
})
