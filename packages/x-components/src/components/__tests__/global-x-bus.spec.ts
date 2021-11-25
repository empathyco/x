import { mount, Wrapper } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';
import { installNewXPlugin } from '../../__tests__/utils';
import GlobalXBus from '../global-x-bus.vue';

function renderGlobalXBus({ listeners = {} }: RenderGlobalXBusOptions = {}): RenderGlobalXBusAPI {
  const [, localVue] = installNewXPlugin();
  const wrapper = mount(GlobalXBus, { listeners, localVue });

  return {
    wrapper
  };
}

describe('testing GlobalXBus component', function () {
  it('executes a callback provided by the listeners when the event is emitted', function () {
    const acceptedAQueryCallback = jest.fn(payload => payload);
    const clickedColumnPickerCallback = jest.fn(payload => payload);
    const { wrapper } = renderGlobalXBus({
      listeners: {
        UserAcceptedAQuery: acceptedAQueryCallback,
        UserClickedColumnPicker: clickedColumnPickerCallback
      }
    });

    wrapper.vm.$x.emit('UserAcceptedAQuery', 'lego');

    expect(acceptedAQueryCallback).toHaveBeenCalledTimes(1);
    expect(acceptedAQueryCallback).toHaveBeenCalledWith('lego', {
      location: undefined,
      moduleName: null
    });

    expect(clickedColumnPickerCallback).not.toHaveBeenCalled();
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
 * Options to configure how the global X bus component should be rendered.
 */
interface RenderGlobalXBusAPI {
  /** The wrapper for the global X bus component. */
  wrapper: Wrapper<Vue>;
}
