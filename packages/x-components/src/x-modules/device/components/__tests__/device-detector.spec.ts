import { DeepPartial } from '@empathyco/x-utils';
import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { installNewXPlugin } from '../../../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../../../../components/x-component.utils';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RootXStoreState } from '../../../../store/store.types';
import { deviceXModule } from '../../x-module';
import DeviceDetector from '../device-detector.vue';

/**
 * Renders the {@link DeviceDetector} component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 * @returns The API for testing the {@link DeviceDetector} component.
 */
async function renderDeviceDetector({
  force,
  throttleMs = 30,
  initialWidth = 1024,
  breakpoints = {
    mobile: 600,
    desktop: Number.POSITIVE_INFINITY
  }
}: RenderDeviceDetectorOptions = {}): Promise<RenderDeviceDetectorAPI> {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = new Store<DeepPartial<RootXStoreState>>({});
  installNewXPlugin({ store }, localVue);

  XPlugin.resetInstance();
  XPlugin.registerXModule(deviceXModule);

  Object.assign(window, { innerWidth: initialWidth });
  const wrapper = mount(DeviceDetector, {
    store,
    localVue,
    propsData: {
      breakpoints,
      throttleMs,
      force
    }
  });

  await localVue.nextTick();

  return {
    wrapper,
    resize(width) {
      Object.assign(window, { innerWidth: width });
      window.dispatchEvent(new UIEvent('resize'));
    },
    waitForThrottle() {
      jest.advanceTimersByTime(throttleMs);
      return localVue.nextTick();
    },
    getDevice() {
      return wrapper.vm.$x.device;
    }
  };
}

describe('testing DeviceDetector component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runAllTimers();
  });

  it('is an x-component', async () => {
    const { wrapper } = await renderDeviceDetector();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });

  it('belongs to the `device` x-module', async () => {
    const { wrapper } = await renderDeviceDetector();

    expect(getXComponentXModuleName(wrapper.vm)).toEqual('device');
  });

  it('detects the device with the provided breakpoints', async () => {
    const { resize, getDevice, waitForThrottle } = await renderDeviceDetector({
      initialWidth: 600,
      breakpoints: {
        // Intentionally unordered breakpoints
        desktop: Number.POSITIVE_INFINITY,
        mobile: 600,
        tablet: 1000
      }
    });

    expect(getDevice()).toBe('mobile');

    resize(601);
    // The resize should be throttled, so no change should happen yet
    expect(getDevice()).toBe('mobile');
    await waitForThrottle();
    expect(getDevice()).toBe('tablet');

    resize(1001);
    await waitForThrottle();
    expect(getDevice()).toBe('desktop');
  });

  it('allows to force a device', async () => {
    const { resize, getDevice, waitForThrottle } = await renderDeviceDetector({
      force: 'not-standard-device',
      initialWidth: 600,
      breakpoints: {
        mobile: 600,
        tablet: 1000,
        desktop: Number.POSITIVE_INFINITY
      }
    });

    expect(getDevice()).toBe('not-standard-device');

    resize(1001);
    await waitForThrottle();
    expect(getDevice()).toBe('not-standard-device');
  });
});

interface RenderDeviceDetectorOptions {
  /** The {@link DeviceDetector.force } prop. */
  force?: string;
  /** The {@link DeviceDetector.throttleMs } prop. */
  throttleMs?: number;
  /** The {@link DeviceDetector.breakpoints } prop. */
  breakpoints?: Record<string, number>;
  /** The initial width of the window. */
  initialWidth?: number;
}

interface RenderDeviceDetectorAPI {
  /** Test wrapper of the {@link DeviceDetector} instance. */
  wrapper: Wrapper<Vue>;
  /** Retrieves the detected device. */
  getDevice: () => string | null;
  /**
   * Resizes the window to the provided width.
   *
   * @param width - The new window width.
   */
  resize: (width: number) => void;
  /**
   * Waits for the throttle time to complete.
   *
   * @returns A promise that resolves after the throttle has completed.
   */
  waitForThrottle: () => Promise<void>;
}
