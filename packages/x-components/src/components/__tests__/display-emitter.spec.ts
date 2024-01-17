import { mount, Wrapper } from '@vue/test-utils';
import Vue, { ref, nextTick, Ref } from 'vue';
import { TaggingRequest } from '@empathyco/x-types';
import { useEmitDisplayEvent } from '../../composables';
import DisplayEmitter from '../display-emitter.vue';
import { getDataTestSelector } from '../../__tests__/utils';

jest.mock('../../composables', () => ({
  useEmitDisplayEvent: jest.fn()
}));

let emitDisplayEventElementSpy: Ref<Vue | null> = ref(null);
let emitDisplayEventPayloadSpy: TaggingRequest = { url: '', params: {} };
const unwatchDisplaySpy = jest.fn();
const refElementVisibility = ref(false);
(useEmitDisplayEvent as jest.Mock).mockImplementation(({ element, taggingRequest }) => {
  // jest doesn't handle well evaluation of dynamic references with `toHaveBeenCalledWith`
  // so we need a spy
  emitDisplayEventElementSpy = element;
  emitDisplayEventPayloadSpy = taggingRequest;

  return {
    isElementVisible: refElementVisibility,
    unwatchDisplay: unwatchDisplaySpy
  };
});

/**
 * Renders the {@link DisplayEmitter} component, exposing a basic API for testing.
 *
 * @param options - The options to render the component with.
 *
 * @returns The API for testing the `DisplayEmitter` component.
 */
function renderDisplayEmitter(
  { payload }: RenderDisplayEmitterOptions = { payload: { url: '', params: {} } }
): RenderDisplayEmitterAPI {
  const wrapper = mount(
    {
      components: {
        DisplayEmitter
      },
      template: `
        <DisplayEmitter :payload="payload">
          <div data-test="child" />
        </DisplayEmitter>`,
      props: ['payload']
    },
    {
      propsData: {
        payload
      }
    }
  );

  return {
    wrapper
  };
}

describe('testing DisplayEmitter component', () => {
  beforeEach(() => {
    refElementVisibility.value = false;
  });

  it('renders everything passed to its default slot', () => {
    const { wrapper } = renderDisplayEmitter();

    expect(wrapper.find(getDataTestSelector('child')).exists()).toBe(true);
  });

  it('uses `useEmitDisplayEvent` underneath', () => {
    renderDisplayEmitter();

    expect(useEmitDisplayEvent).toHaveBeenCalled();
  });

  it('provides `useEmitDisplayEvent` with the element in the slot to watch', async () => {
    renderDisplayEmitter();

    await nextTick();

    expect(emitDisplayEventElementSpy.value).not.toBe(null);
    expect(emitDisplayEventElementSpy.value?.$el.getAttribute('data-test')).toBe('child');
  });

  // eslint-disable-next-line max-len
  it('provides `useEmitDisplayEvent` with the payload to emit with the display event', () => {
    const payload = { url: 'test-url', params: { test: 'param' } };
    renderDisplayEmitter({
      payload
    });

    expect(useEmitDisplayEvent).toHaveBeenCalled();
    expect(emitDisplayEventPayloadSpy).toBe(payload);
  });

  it('removes the watcher on unmount', async () => {
    const { wrapper } = renderDisplayEmitter();

    wrapper.destroy();
    await nextTick();
    expect(unwatchDisplaySpy).toHaveBeenCalled();
  });
});

interface RenderDisplayEmitterOptions {
  /** The payload to provide. */
  payload?: TaggingRequest;
}

interface RenderDisplayEmitterAPI {
  /** The wrapper testing component instance. */
  wrapper: Wrapper<Vue>;
}
