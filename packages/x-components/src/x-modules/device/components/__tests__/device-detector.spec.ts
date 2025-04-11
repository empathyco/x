import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { XDummyBus } from '../../../../__tests__/bus.dummy'
import { installNewXPlugin } from '../../../../__tests__/utils'
import { getXComponentXModuleName, isXComponent } from '../../../../components'
import DeviceDetector from '../device-detector.vue'

const metadata = { location: 'none', moduleName: 'device', replaceable: true }

/**
 * Renders the {@link DeviceDetector} component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @param options.force - force option.
 * @param options.throttleMs - throttleMs option.
 * @param options.initialWidth - initialWidth option.
 * @param options.breakpoints - breakpoints option.
 * @returns The API for testing the {@link DeviceDetector} component.
 */
async function renderDeviceDetector({
  force = '',
  throttleMs = 30,
  initialWidth = 1024,
  breakpoints = {
    mobile: 600,
    tablet: 1000,
    desktop: Number.POSITIVE_INFINITY,
  },
} = {}) {
  Object.assign(window, { innerWidth: initialWidth })
  const xBus = new XDummyBus()
  const emitSpy = jest.spyOn(xBus, 'emit')

  const wrapper = mount(DeviceDetector, {
    props: {
      breakpoints,
      throttleMs,
      force,
    },
    global: { plugins: [installNewXPlugin({}, xBus)] },
  })

  await nextTick()

  return {
    wrapper,
    emitSpy,
    resize: (width: any) => {
      Object.assign(window, { innerWidth: width })
      window.dispatchEvent(new UIEvent('resize'))
    },
    waitForThrottle: async () => {
      jest.advanceTimersByTime(throttleMs)
      return nextTick()
    },
  }
}

describe('testing DeviceDetector component', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.runAllTimers()
  })

  it('is an x-component', async () => {
    const { wrapper } = await renderDeviceDetector()

    expect(isXComponent(wrapper.vm)).toEqual(true)
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('device')
  })

  it('belongs to the `device` x-module', async () => {
    const { wrapper } = await renderDeviceDetector()

    expect(getXComponentXModuleName(wrapper.vm)).toEqual('device')
  })

  it('detects the device with the provided breakpoints', async () => {
    const { resize, emitSpy, waitForThrottle } = await renderDeviceDetector({
      initialWidth: 600,
      breakpoints: {
        // Intentionally unordered breakpoints
        desktop: Number.POSITIVE_INFINITY,
        mobile: 600,
        tablet: 1000,
      },
    })

    expect(emitSpy).toHaveBeenLastCalledWith('DeviceProvided', 'mobile', metadata)

    resize(601)
    // The resize should be throttled, so no change should happen yet
    expect(emitSpy).toHaveBeenLastCalledWith('DeviceProvided', 'mobile', metadata)
    await waitForThrottle()
    expect(emitSpy).toHaveBeenLastCalledWith('DeviceProvided', 'tablet', metadata)

    resize(1001)
    await waitForThrottle()
    expect(emitSpy).toHaveBeenLastCalledWith('DeviceProvided', 'desktop', metadata)
  })

  it('allows to force a device', async () => {
    const { resize, emitSpy, waitForThrottle } = await renderDeviceDetector({
      force: 'not-standard-device',
      initialWidth: 600,
      breakpoints: {
        mobile: 600,
        tablet: 1000,
        desktop: Number.POSITIVE_INFINITY,
      },
    })

    expect(emitSpy).toHaveBeenLastCalledWith('DeviceProvided', 'not-standard-device', metadata)

    resize(1001)
    await waitForThrottle()
    expect(emitSpy).toHaveBeenLastCalledWith('DeviceProvided', 'not-standard-device', metadata)
  })
})
