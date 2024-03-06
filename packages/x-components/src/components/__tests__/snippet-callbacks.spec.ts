import { mount } from '@vue/test-utils';
import { installNewXPlugin } from '../../__tests__/utils';
import { baseSnippetConfig } from '../../views/base-config';
import { XEventListeners } from '../../x-installer/api/api.types';
import SnippetCallbacks from '../snippet-callbacks.vue';
import { bus } from '../../plugins/x-bus';
import { WireMetadata } from '../../wiring/index';

function renderSnippetCallbacks({ callbacks = {} }: RenderSnippetCallbacksOptions = {}): void {
  const [, localVue] = installNewXPlugin();
  mount(SnippetCallbacks, {
    provide: {
      snippetConfig: localVue.observable({ ...baseSnippetConfig, callbacks })
    },
    localVue
  });
}

describe('testing SnippetCallbacks component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('executes a callback injected from the snippetConfig', () => {
    const acceptedAQueryCallback = jest.fn(payload => payload);
    const clickedColumnPickerCallback = jest.fn(payload => payload);
    renderSnippetCallbacks({
      callbacks: {
        UserAcceptedAQuery: acceptedAQueryCallback,
        UserClickedColumnPicker: clickedColumnPickerCallback
      }
    });

    const eventMetadata: WireMetadata = {
      location: 'none',
      moduleName: null,
      replaceable: true
    };

    bus.emit('UserAcceptedAQuery', 'lego', eventMetadata);
    jest.runAllTimers();

    expect(acceptedAQueryCallback).toHaveBeenCalledTimes(1);
    expect(acceptedAQueryCallback).toHaveBeenCalledWith('lego', eventMetadata);

    expect(clickedColumnPickerCallback).not.toHaveBeenCalled();

    bus.emit('UserClickedColumnPicker', 1, eventMetadata);
    jest.runAllTimers();

    expect(acceptedAQueryCallback).toHaveBeenCalledTimes(1);

    expect(clickedColumnPickerCallback).toHaveBeenCalledTimes(1);
    expect(clickedColumnPickerCallback).toHaveBeenCalledWith(1, eventMetadata);
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
