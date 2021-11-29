import { mount, Wrapper } from '@vue/test-utils';
import { installNewXPlugin } from '../../__tests__/utils';
import { baseSnippetConfig } from '../../views/base-config';
import { XEventListeners } from '../../x-installer/api/api.types';
import SnippetCallbacks from '../snippet-callbacks.vue';

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

describe('testing SnippetCallbacks component', () => {
  it('executes a callback injected from the snippetConfig', () => {
    const acceptedAQueryCallback = jest.fn(payload => payload);
    const clickedColumnPickerCallback = jest.fn(payload => payload);
    const { wrapper } = renderSnippetCallbacks({
      callbacks: {
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

  it('emits a SnippetCallbackExecuted event when a callback is executed', () => {
    const acceptedAQueryCallback = jest.fn(payload => payload);
    const clickedColumnPickerCallback = jest.fn(payload => payload);
    const { wrapper } = renderSnippetCallbacks({
      callbacks: {
        UserAcceptedAQuery: acceptedAQueryCallback,
        UserClickedColumnPicker: clickedColumnPickerCallback
      }
    });

    const eventSpy = jest.fn();
    wrapper.vm.$x.on('SnippetCallbackExecuted').subscribe(eventSpy);

    wrapper.vm.$x.emit('UserAcceptedAQuery', 'playmobil');
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy).toHaveBeenCalledWith({
      event: 'UserAcceptedAQuery',
      callbackReturn: 'playmobil'
    });

    wrapper.vm.$x.emit('UserClickedColumnPicker', 3);
    expect(eventSpy).toHaveBeenCalledTimes(2);
    expect(eventSpy).toHaveBeenCalledWith({
      event: 'UserClickedColumnPicker',
      callbackReturn: 3
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
