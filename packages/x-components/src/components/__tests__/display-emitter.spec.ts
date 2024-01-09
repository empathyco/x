import { mount, Wrapper } from '@vue/test-utils';
import Vue, { ref } from 'vue';
import { Component } from 'vue-property-decorator';
import { TaggingRequest } from '@empathyco/x-types';
import { useElementVisibility } from '@vueuse/core';
import DisplayEmitter from '../display-emitter.vue';

@Component({
  template: `
    <button data-test="child" />
  `
})
class Child extends Vue {}

const refElementVisibility = ref(false);

/* eslint-disable */
// @ts-ignore
useElementVisibility = jest.fn().mockReturnValue(refElementVisibility);
/* eslint-enable */

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
  const emitSpy = jest.fn();

  const wrapper = mount(
    {
      components: {
        DisplayEmitter,
        Child
      },
      template: `
        <DisplayEmitter :payload="payload">
          <Child v-show="showChild" />
        </DisplayEmitter>`,
      props: ['payload', 'showChild']
    },
    {
      propsData: {
        payload,
        showChild: false
      },
      mocks: {
        $x: {
          emit: emitSpy
        }
      }
    }
  );

  const toggleChildVisibility = async (): Promise<void> => {
    refElementVisibility.value = !refElementVisibility.value;
    await wrapper.vm.$nextTick();
  };

  return {
    wrapper,
    child: wrapper.findComponent<Child>(Child),
    emitSpy,
    toggleChildVisibility
  };
}

describe('testing DisplayEmitter component', () => {
  beforeEach(() => {
    refElementVisibility.value = false;
  });

  it('renders everything passed to its default slot', () => {
    const { child } = renderDisplayEmitter();

    expect(child.exists()).toBe(true);
  });

  // eslint-disable-next-line max-len
  it('emits TrackableElementDisplayed with provided payload when the child is visible', async () => {
    const payload = { url: 'test-url', params: { test: 'param' } };
    const { emitSpy, toggleChildVisibility } = renderDisplayEmitter({
      payload
    });

    await toggleChildVisibility();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('TrackableElementDisplayed', payload);
  });

  // eslint-disable-next-line max-len
  it('emits TrackableElementDisplayed when the child is visible only for the first time', async () => {
    const { emitSpy, toggleChildVisibility } = renderDisplayEmitter();

    await toggleChildVisibility();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('TrackableElementDisplayed', expect.anything());

    await toggleChildVisibility();
    await toggleChildVisibility();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});

interface RenderDisplayEmitterOptions {
  /** The payload to provide. */
  payload?: TaggingRequest;
}

interface RenderDisplayEmitterAPI {
  /** The wrapper testing component instance. */
  wrapper: Wrapper<Vue>;
  /** The wrapper for the child component inside the display emitter. */
  child: Wrapper<Child>;
  /** The emit spy. */
  emitSpy: jest.Mock;
  /** Toggle child visibility. */
  toggleChildVisibility: () => Promise<void>;
}
