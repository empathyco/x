import { mount, Wrapper } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';
import GlobalXBus from '../global-x-bus.vue';
import { bus } from '../../plugins/x-bus';

function renderGlobalXBus({ listeners = {} }: RenderGlobalXBusOptions = {}): RenderGlobalXBusAPI {
  const wrapper = mount(GlobalXBus, { listeners });

  return {
    wrapper
  };
}

describe('testing GlobalXBus component', function () {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('executes a callback provided by the listeners when the event is emitted', function () {
    const acceptedAQueryCallback = jest.fn(payload => payload);
    const clickedColumnPickerCallback = jest.fn(payload => payload);
    renderGlobalXBus({
      listeners: {
        UserAcceptedAQuery: acceptedAQueryCallback,
        UserClickedColumnPicker: clickedColumnPickerCallback
      }
    });

    bus.emit('UserAcceptedAQuery', 'lego');

    jest.runAllTimers();

    expect(acceptedAQueryCallback).toHaveBeenCalledTimes(1);
    expect(acceptedAQueryCallback).toHaveBeenCalledWith('lego', expect.any(Object));

    expect(clickedColumnPickerCallback).not.toHaveBeenCalled();
  });

  it('unsubscribes from the listeners when the component is unmounted', function () {
    const clickedColumnPickerCallback = jest.fn(payload => payload);

    const { wrapper } = renderGlobalXBus({
      listeners: {
        UserClickedColumnPicker: clickedColumnPickerCallback
      }
    });

    bus.emit('UserClickedColumnPicker');

    jest.runAllTimers();

    expect(clickedColumnPickerCallback).toHaveBeenCalledTimes(1);

    wrapper.destroy();

    bus.emit('UserClickedColumnPicker');

    jest.runAllTimers();
    expect(clickedColumnPickerCallback).toHaveBeenCalledTimes(1);
  });
});

/**
 * Options to configure how the global X bus component should be rendered.
 */
interface RenderGlobalXBusOptions {
  /** The listeners object in the component.*/
  listeners?: ComponentOptions<Vue>['methods'];
}

/**
 * API for the renderGlobalXBus.
 */
interface RenderGlobalXBusAPI {
  wrapper: Wrapper<Vue>;
}
