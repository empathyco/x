import { mount, Wrapper } from '@vue/test-utils';
import { installNewXPlugin } from '../../__tests__/utils';
import { baseSnippetConfig } from '../../views/base-config';
import { XEventListeners } from '../../x-installer/api/api.types';
import SnippetCallbacks from '../snippet-callbacks.vue';
import { bus } from '../../plugins/x-bus';
import { WireMetadata } from '../../wiring/index';

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

    acceptedAQueryCallback.mockClear();
    clickedColumnPickerCallback.mockClear();
  });
});

/**
 * Tests have been split into 2 describe blocks.
 * It seems there's some interference between them when they are ran in the same describe scope.
 * Clearing all mocks after each test doesn't do the job.
 */
describe('when testing event emission', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('emits a SnippetCallbackExecuted event when a callback is executed', () => {
    const acceptedAQueryCallback = jest.fn((payload: string) => payload + '1');
    const clickedColumnPickerCallback = jest.fn((payload: number) => payload + 1);
    const { wrapper } = renderSnippetCallbacks({
      callbacks: {
        UserAcceptedAQuery: acceptedAQueryCallback,
        UserClickedColumnPicker: clickedColumnPickerCallback
      }
    });

    // TODO: Check why using bus.on directly doesn't make calls
    const eventSpy = jest.fn();
    wrapper.vm.$x.on('SnippetCallbackExecuted').subscribe(eventSpy);

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
