import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import XModal from '../x-modal.vue';
import { PropsWithType } from '../../../utils/types';
import { XEventsTypes } from '../../../wiring/events.types';

/**
 * Renders a {@link XModal} component with the provided options and offers an API to easily
 * test it.
 *
 * @param options - The options to render the component with.
 * @returns An API to test the component.
 */
function renderXModal({ template = '<XModal/>' }: RenderXModalOptions = {}): RenderXModalAPI {
  const [, localVue] = installNewXPlugin();
  const parent = document.createElement('div');
  document.body.appendChild(parent);

  const wrapper = mount(
    {
      template,
      components: { XModal }
    },
    {
      attachTo: parent,
      localVue
    }
  );

  return {
    wrapper,
    async clickModalOverlay() {
      await wrapper.find(getDataTestSelector('modal-overlay'))?.trigger('click');
    },
    async emit(event) {
      wrapper.vm.$x.emit(event);
      await localVue.nextTick();
    },
    getModalContent() {
      return wrapper.find(getDataTestSelector('modal-content'));
    },
    async focusOutOfModal() {
      document.body.dispatchEvent(new FocusEvent('focusin'));
      await localVue.nextTick();
    }
  };
}

describe('testing X Modal  component', () => {
  it('opens and closes when UserClickedOpenX and UserClickedClosedX are emitted', async () => {
    const { emit, getModalContent } = renderXModal();
    expect(getModalContent().exists()).toBe(false);

    await emit('UserClickedOpenX');
    expect(getModalContent().exists()).toBe(true);

    await emit('UserClickedCloseX');
    expect(getModalContent().exists()).toBe(false);
  });

  it('closes when clicking on the modal overlay', async () => {
    const { clickModalOverlay, emit, getModalContent } = renderXModal();

    await emit('UserClickedOpenX');
    expect(getModalContent().exists()).toBe(true);

    await clickModalOverlay();
    expect(getModalContent().exists()).toBe(false);
  });

  it('closes when focusing any other element out of the modal', async () => {
    const { emit, focusOutOfModal, getModalContent } = renderXModal();

    await emit('UserClickedOpenX');
    expect(getModalContent().exists()).toBe(true);

    await focusOutOfModal();
    expect(getModalContent().exists()).toBe(false);
  });

  it('does not close when clicking inside the content', async () => {
    const { wrapper, emit, getModalContent } = renderXModal({
      template: `
        <XModal>
          <button data-test="test-button">Modal should still be opened when I'm clicked</button>
        </XModal>
      `
    });

    await emit('UserClickedOpenX');
    expect(getModalContent().exists()).toBe(true);

    await wrapper.find(getDataTestSelector('test-button')).trigger('click');
    expect(getModalContent().exists()).toBe(true);
  });
});

interface RenderXModalOptions {
  /** The template to render. */
  template?: string;
}

interface RenderXModalAPI {
  /** The wrapper for the modal component. */
  wrapper: Wrapper<Vue>;
  /** Fakes a click on the modal overlay. */
  clickModalOverlay: () => Promise<void>;
  /** Emits the provided event. */
  emit: (event: PropsWithType<XEventsTypes, void>) => Promise<void>;
  /** Fakes a focusin event in another HTMLElement of the body. */
  focusOutOfModal: () => Promise<void>;
  /** Retrieves the modal content. */
  getModalContent: () => Wrapper<Vue>;
}
