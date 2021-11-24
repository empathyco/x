import { mount } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';
import { installNewXPlugin } from '../../__tests__/utils';
import { XComponentBusAPI } from '../../plugins/x-plugin.types';
import GlobalXBus from '../global-x-bus.vue';

function renderGlobalXBus({ listeners = {} }: RenderGlobalXBusOptions = {}): RenderGlobalXBusAPI {
  const [, localVue] = installNewXPlugin();
  const wrapper = mount(GlobalXBus, { listeners, localVue });

  return {
    on: wrapper.vm.$x.on.bind(wrapper.vm.$x),
    emit: wrapper.vm.$x.emit.bind(wrapper.vm.$x)
  };
}

describe('testing GlobalXBus component', function () {
  it('executes a callback provided with the listeners when the event is emitted', function () {
    const acceptedAQueryCallback = jest.fn(payload => payload);
    const clickedColumnPickerCallback = jest.fn(payload => payload);
    const { emit } = renderGlobalXBus({
      listeners: {
        UserAcceptedAQuery: acceptedAQueryCallback,
        UserClickedColumnPicker: clickedColumnPickerCallback
      }
    });

    emit('UserAcceptedAQuery', 'lego');
    emit('UserClickedColumnPicker', 2);

    expect(acceptedAQueryCallback).toHaveBeenNthCalledWith(1, 'lego', {
      location: undefined,
      moduleName: null
    });
    expect(clickedColumnPickerCallback).toHaveBeenNthCalledWith(1, 2, {
      location: undefined,
      moduleName: null
    });
  });

  it('emits a SnippetCallbackExecuted event when a callback is executed', function () {
    const acceptedAQueryCallback = jest.fn(payload => payload);
    const clickedColumnPickerCallback = jest.fn(payload => payload);
    const { on, emit } = renderGlobalXBus({
      listeners: {
        UserAcceptedAQuery: acceptedAQueryCallback,
        UserClickedColumnPicker: clickedColumnPickerCallback
      }
    });

    const eventSpy = jest.fn();
    on('SnippetCallbackExecuted').subscribe(eventSpy);

    emit('UserAcceptedAQuery', 'playmobil');
    expect(eventSpy).toHaveBeenNthCalledWith(1, {
      event: 'UserAcceptedAQuery',
      callbackReturn: 'playmobil'
    });

    emit('UserClickedColumnPicker', 3);
    expect(eventSpy).toHaveBeenNthCalledWith(2, {
      event: 'UserClickedColumnPicker',
      callbackReturn: 3
    });
  });
});

/**
 * Options to configure how the progress bar component should be rendered.
 */
interface RenderGlobalXBusOptions {
  /** The listeners object in the component.*/
  listeners?: ComponentOptions<Vue>['methods'];
}

/**
 * Options to configure how the progress bar component should be rendered.
 */
interface RenderGlobalXBusAPI {
  /** The {@link XComponentBusAPI.on} method to subscribe events. */
  on: XComponentBusAPI['on'];
  /** The {@link XComponentBusAPI.emit} method to emit events. */
  emit: XComponentBusAPI['emit'];
}
