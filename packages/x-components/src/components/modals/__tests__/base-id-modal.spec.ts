import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import { XEvent } from '../../../wiring/events.types';
import BaseIdModal from '../base-id-modal.vue';

/**
 * Mounts a {@link BaseIdModal} component with the provided options and offers an API to easily
 * test it.
 *
 * @param options - The options to render the component with.
 * @returns An API to test the component.
 */
function mountBaseIdModal({
  modalId = 'myModal',
  defaultSlot = `<span data-test="default-slot">Modal: ${modalId}</span>`
}: MountBaseIdModalOptions = {}): MountBaseIdModalAPI {
  const [, localVue] = installNewXPlugin();
  const parent = document.createElement('div');
  document.body.appendChild(parent);

  const wrapper = mount(BaseIdModal, {
    attachTo: parent,
    localVue,
    propsData: { modalId },
    slots: {
      default: defaultSlot
    }
  });

  return {
    wrapper,
    modalId,
    async emit(event: XEvent) {
      wrapper.vm.$x.emit(event, modalId);
      await localVue.nextTick();
    },
    async click(string) {
      await wrapper.get(getDataTestSelector(string))?.trigger('click');
    },
    getModalContent() {
      return wrapper.find(getDataTestSelector('modal-content'));
    },
    async fakeFocusIn() {
      const buttonWrapper = mount({
        template: `<button>Button</button>`
      });
      document.body.appendChild(wrapper.element);
      document.body.appendChild(buttonWrapper.element);

      await buttonWrapper.trigger('focusin');

      document.body.removeChild(wrapper.element);
      document.body.removeChild(buttonWrapper.element);
    }
  };
}

describe('testing BaseIdModal  component', () => {
  it('opens when UserClickedOpenModal event is emitted', async () => {
    const { emit, getModalContent } = mountBaseIdModal();
    expect(getModalContent().exists()).toBe(false);

    await emit('UserClickedOpenModal');
    expect(getModalContent().exists()).toBe(true);
  });

  it('closes when UserClickedCloseModal or UserClickedOutOfModal events are emitted', async () => {
    const { emit, getModalContent } = mountBaseIdModal();
    await emit('UserClickedOpenModal');
    expect(getModalContent().exists()).toBe(true);

    await emit('UserClickedCloseModal');
    expect(getModalContent().exists()).toBe(false);

    await emit('UserClickedOpenModal');
    expect(getModalContent().exists()).toBe(true);

    await emit('UserClickedOutOfModal');
    expect(getModalContent().exists()).toBe(false);
  });

  it('closes when clicking on the modal overlay', async () => {
    const { click, emit, getModalContent } = mountBaseIdModal();

    await emit('UserClickedOpenModal');
    expect(getModalContent().exists()).toBe(true);

    await click('modal-overlay');
    expect(getModalContent().exists()).toBe(false);
  });

  it('closes when focusing any other element out of the modal', async () => {
    const { emit, fakeFocusIn, getModalContent } = mountBaseIdModal();

    await emit('UserClickedOpenModal');
    expect(getModalContent().exists()).toBe(true);

    await fakeFocusIn();
    expect(getModalContent().exists()).toBe(false);
  });

  it("doesn't not close when clicking on either the modal or its content", async () => {
    const { wrapper, click, emit, getModalContent } = mountBaseIdModal({
      defaultSlot: `
        <button data-test="test-button">Modal should still be opened when I'm clicked</button>
      `
    });

    await emit('UserClickedOpenModal');
    expect(getModalContent().exists()).toBe(true);

    await click('modal-content');
    expect(getModalContent().exists()).toBe(true);

    await wrapper.find(getDataTestSelector('test-button'))?.trigger('click');
    expect(getModalContent().exists()).toBe(true);
  });
});

interface MountBaseIdModalOptions {
  /** The default slot to render. */
  defaultSlot?: string;
  /** The modal id. */
  modalId?: string;
}

interface MountBaseIdModalAPI {
  /** The wrapper for the modal component. */
  wrapper: Wrapper<Vue>;
  /** The modal id. */
  modalId: string;
  /** Emits the provided event. */
  emit: (event: XEvent) => Promise<void>;
  /** Fakes a click on an element. */
  click: (element: string) => Promise<void>;
  /** Fakes a focusin event in another HTMLElement of the body. */
  fakeFocusIn: () => Promise<void>;
  /** Retrieves the modal content. */
  getModalContent: () => Wrapper<Vue>;
}
