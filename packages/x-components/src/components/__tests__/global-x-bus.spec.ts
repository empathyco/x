import { mount } from '@vue/test-utils'
import { installNewXPlugin } from '../../__tests__/utils'
import { XPlugin } from '../../plugins/index'
import GlobalXBus from '../global-x-bus.vue'

function renderGlobalXBus({ listeners = {} } = {}) {
  return {
    wrapper: mount(GlobalXBus, {
      props: { listeners },
      global: { plugins: [installNewXPlugin()] },
    }),
  } as const
}

describe('testing GlobalXBus component', () => {
  it('executes a callback provided by the listeners when the event is emitted', async () => {
    const acceptedAQueryCallback = jest.fn(payload => payload)
    const clickedColumnPickerCallback = jest.fn(payload => payload)
    renderGlobalXBus({
      listeners: {
        UserAcceptedAQuery: acceptedAQueryCallback,
        UserClickedColumnPicker: clickedColumnPickerCallback,
      },
    })

    await XPlugin.bus.emit('UserAcceptedAQuery', 'lego')

    expect(acceptedAQueryCallback).toHaveBeenCalledTimes(1)
    expect(acceptedAQueryCallback).toHaveBeenCalledWith('lego', expect.any(Object))

    expect(clickedColumnPickerCallback).not.toHaveBeenCalled()
  })

  it('unsubscribes from the listeners when the component is unmounted', async () => {
    const clickedColumnPickerCallback = jest.fn(payload => payload)
    const { wrapper } = renderGlobalXBus({
      listeners: {
        UserClickedColumnPicker: clickedColumnPickerCallback,
      },
    })

    await XPlugin.bus.emit('UserClickedColumnPicker', 1)
    expect(clickedColumnPickerCallback).toHaveBeenCalledTimes(1)

    wrapper.unmount()

    await XPlugin.bus.emit('UserClickedColumnPicker', 1)
    expect(clickedColumnPickerCallback).toHaveBeenCalledTimes(1)
  })
})
