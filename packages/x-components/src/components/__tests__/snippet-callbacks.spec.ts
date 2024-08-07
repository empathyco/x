import { mount, VueWrapper } from '@vue/test-utils';
import { baseSnippetConfig } from '../../views/base-config';
import { XEventListeners } from '../../x-installer/api/api.types';
import SnippetCallbacks from '../snippet-callbacks.vue';
import { bus } from '../../plugins/x-bus';
import { dummyCreateEmitter } from '../../__tests__/bus.dummy';

// Making bus not repeat subjects
jest.spyOn(bus, 'createEmitter' as any).mockImplementation(dummyCreateEmitter.bind(bus) as any);

function renderSnippetCallbacks({
  callbacks = {}
}: RenderSnippetCallbacksOptions = {}): RenderSnippetCallbacksAPI {
  const wrapper = mount(SnippetCallbacks, {
    provide: {
      snippetConfig: { ...baseSnippetConfig, callbacks }
    }
  });

  return {
    wrapper
  };
}

describe('testing SnippetCallbacks component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('executes a callback injected from the snippetConfig', () => {
    const acceptedAQueryCallback = jest.fn(payload => payload);
    const clickedColumnPickerCallback = jest.fn(payload => payload);
    const { wrapper } = renderSnippetCallbacks({
      callbacks: {
        UserAcceptedAQuery: acceptedAQueryCallback,
        UserClickedColumnPicker: clickedColumnPickerCallback
      }
    });

    bus.emit('UserAcceptedAQuery', 'lego');
    jest.runAllTimers();

    expect(acceptedAQueryCallback).toHaveBeenCalledTimes(1);
    expect(acceptedAQueryCallback).toHaveBeenCalledWith('lego', expect.any(Object));

    expect(clickedColumnPickerCallback).not.toHaveBeenCalled();

    bus.emit('UserClickedColumnPicker', 1);
    jest.runAllTimers();

    expect(acceptedAQueryCallback).toHaveBeenCalledTimes(1);

    expect(clickedColumnPickerCallback).toHaveBeenCalledTimes(1);
    expect(clickedColumnPickerCallback).toHaveBeenCalledWith(1, expect.any(Object));

    // Force unsubscribing
    wrapper.unmount();
  });

  it('emits a SnippetCallbackExecuted event when a callback is executed', () => {
    const acceptedAQueryCallback = jest.fn((payload: string) => payload + '1');
    const clickedColumnPickerCallback = jest.fn((payload: number) => payload + 1);
    renderSnippetCallbacks({
      callbacks: {
        UserAcceptedAQuery: acceptedAQueryCallback,
        UserClickedColumnPicker: clickedColumnPickerCallback
      }
    });

    const eventSpy = jest.fn();
    bus.on('SnippetCallbackExecuted').subscribe(eventSpy);

    bus.emit('UserAcceptedAQuery', 'playmobil');
    jest.runAllTimers();

    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledWith({
      event: 'UserAcceptedAQuery',
      callbackReturn: 'playmobil1',
      payload: 'playmobil',
      metadata: expect.any(Object)
    });

    bus.emit('UserClickedColumnPicker', 3);
    jest.runAllTimers();

    expect(eventSpy).toHaveBeenCalledTimes(2);
    expect(eventSpy).toHaveBeenCalledWith({
      event: 'UserClickedColumnPicker',
      callbackReturn: 4,
      payload: 3,
      metadata: expect.any(Object)
    });
  });
});

/**
 * Options to configure how the snippet callbacks component should be rendered.
 */
interface RenderSnippetCallbacksOptions {
  /** The callbacks value to be provided. */
  callbacks?: XEventListeners;
}

/**
 * Tools to test how the snippet callbacks component behaves.
 */
interface RenderSnippetCallbacksAPI {
  /** The wrapper of the container element. */
  wrapper: VueWrapper;
}
