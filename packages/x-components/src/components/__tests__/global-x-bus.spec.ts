import { mount } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';
import { installNewXPlugin } from '../../__tests__/utils';
import { XComponentBusAPI } from '../../plugins/x-plugin.types';
import GlobalXBus from '../global-x-bus.vue';

function renderGlobalXBus({ listeners = {} }: RenderGlobalXBusOptions = {}): RenderGlobalXBusAPI {
  const [, localVue] = installNewXPlugin();
  const wrapper = mount(GlobalXBus, { listeners, localVue });

  return {
    emit: wrapper.vm.$x.emit.bind(wrapper.vm.$x)
  };
}

describe('testing GlobalXBus component', function () {
  it('executes a callback provided by the listeners when the event is emitted', function () {
    const acceptedAQueryCallback = jest.fn(payload => payload);
    const clickedColumnPickerCallback = jest.fn(payload => payload);
    const { emit } = renderGlobalXBus({
      listeners: {
        UserAcceptedAQuery: acceptedAQueryCallback,
        UserClickedColumnPicker: clickedColumnPickerCallback
      }
    });

    emit('UserAcceptedAQuery', 'lego');

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
  /** The {@link XComponentBusAPI.emit} method to emit events. */
  emit: XComponentBusAPI['emit'];
}
