import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import MainModal from '../main-modal.vue';
import { PropsWithType } from '../../../utils/types';
import { XEventsTypes } from '../../../wiring/events.types';

/**
 * Renders a {@link MainModal} component with the provided options and offers an API to easily
 * test it.
 *
 * @param options - The options to render the component with.
 * @returns An API to test the component.
 */
function renderMainModal({
  template = '<MainModal/>'
}: RenderMainModalOptions = {}): RenderMainModalAPI {
  const [, localVue] = installNewXPlugin();
  const parent = document.createElement('div');
  document.body.appendChild(parent);

  const wrapper = mount(
    {
      template,
      components: { MainModal }
    },
    {
      attachTo: parent, // necessary to make the focus on body event to work in some environments.
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

describe('testing Main Modal  component', () => {
  it('opens and closes when UserClickedOpenX and UserClickedClosedX are emitted', async () => {
    const { emit, getModalContent } = renderMainModal();
    expect(getModalContent().exists()).toBe(false);

    await emit('UserClickedOpenX');
    expect(getModalContent().exists()).toBe(true);

    await emit('UserClickedCloseX');
    expect(getModalContent().exists()).toBe(false);
  });

  it('closes when clicking on the modal overlay', async () => {
    const { clickModalOverlay, emit, getModalContent } = renderMainModal();

    await emit('UserClickedOpenX');
    expect(getModalContent().exists()).toBe(true);

    await clickModalOverlay();
    expect(getModalContent().exists()).toBe(false);
  });

  it('closes when focusing any other element out of the modal', async () => {
    const { emit, focusOutOfModal, getModalContent } = renderMainModal();

    await emit('UserClickedOpenX');
    expect(getModalContent().exists()).toBe(true);

    await focusOutOfModal();
    expect(getModalContent().exists()).toBe(false);
  });

  it('does not close when clicking inside the content', async () => {
    const { wrapper, emit, getModalContent } = renderMainModal({
      template: `
        <MainModal>
          <button data-test="test-button">Modal should still be opened when I'm clicked</button>
        </MainModal>
      `
    });

    await emit('UserClickedOpenX');
    expect(getModalContent().exists()).toBe(true);

    await wrapper.find(getDataTestSelector('test-button')).trigger('click');
    expect(getModalContent().exists()).toBe(true);
  });
});

interface RenderMainModalOptions {
  /** The template to render. */
  template?: string;
}

interface RenderMainModalAPI {
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
