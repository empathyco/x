import { mount, Wrapper } from '@vue/test-utils';
import { installNewXPlugin } from '../../__tests__/utils';
import { baseSnippetConfig } from '../../views/base-config';
import { XEventListeners } from '../../x-installer/api/api.types';
import SnippetCallbacks from '../snippet-callbacks.vue';
import { bus } from '../../plugins/index';

function renderSnippetCallbacks({
  callbacks = {}
}: RenderSnippetCallbacksOptions = {}): RenderSnippetCallbacksAPI {
  const [, localVue] = installNewXPlugin();
  const wrapper = mount(SnippetCallbacks, {
    provide: {
      snippetConfig: localVue.observable({ ...baseSnippetConfig, callbacks })
    },
    localVue
  });

  return {
    wrapper
  };
}

// TODO: Refactor in EMP-3380
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('testing SnippetCallbacks component', () => {
  it('executes a callback injected from the snippetConfig', () => {
    const acceptedAQueryCallback = jest.fn(payload => payload);
    const clickedColumnPickerCallback = jest.fn(payload => payload);
    renderSnippetCallbacks({
      callbacks: {
        UserAcceptedAQuery: acceptedAQueryCallback,
        UserClickedColumnPicker: clickedColumnPickerCallback
      }
    });

    bus.emit('UserAcceptedAQuery', 'lego');

    expect(acceptedAQueryCallback).toHaveBeenCalledTimes(1);
    expect(acceptedAQueryCallback).toHaveBeenCalledWith('lego', {
      location: undefined,
      moduleName: null,
      replaceable: true
    });

    expect(clickedColumnPickerCallback).not.toHaveBeenCalled();

    bus.emit('UserClickedColumnPicker', 1);

    expect(acceptedAQueryCallback).toHaveBeenCalledTimes(1);

    expect(clickedColumnPickerCallback).toHaveBeenCalledTimes(1);
    expect(clickedColumnPickerCallback).toHaveBeenCalledWith(1, {
      location: undefined,
      moduleName: null,
      replaceable: true
    });
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
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledWith({
      event: 'UserAcceptedAQuery',
      callbackReturn: 'playmobil1',
      payload: 'playmobil',
      metadata: expect.any(Object)
    });

    bus.emit('UserClickedColumnPicker', 3);
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
  wrapper: Wrapper<Vue>;
}
