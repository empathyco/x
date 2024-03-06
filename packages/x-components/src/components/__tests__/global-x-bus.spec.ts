import { mount } from '@vue/test-utils';
import Vue, { ComponentOptions } from 'vue';
import { installNewXPlugin } from '../../__tests__/utils';
import GlobalXBus from '../global-x-bus.vue';
import { bus } from '../../plugins/x-bus';

function renderGlobalXBus({ listeners = {} }: RenderGlobalXBusOptions = {}): void {
  const [, localVue] = installNewXPlugin();
  mount(GlobalXBus, { listeners, localVue });
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

    bus.emit('UserAcceptedAQuery', 'lego', expect.any(Object));

    jest.runAllTimers();

    expect(acceptedAQueryCallback).toHaveBeenCalledTimes(1);
    expect(acceptedAQueryCallback).toHaveBeenCalledWith('lego', expect.any(Object));

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
