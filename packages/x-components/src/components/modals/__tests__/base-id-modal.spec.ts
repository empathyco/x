import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseIdModal from '../base-id-modal.vue';

/**
 * Renders the {@link BaseIdModal} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
function renderBaseIdModal({
  id = 'myModal',
  template = `<BaseIdModal modalId="${id}" v-bind="$attrs" />`
}: RenderBaseIdModalOptions = {}): RenderBaseIdModalAPI {
  const [, localVue] = installNewXPlugin();
  const div = document.createElement('div');
  document.body.appendChild(div);
  const wrapper = mount(
    {
      components: {
        BaseIdModal
      },
      template
    },
    { propsData: { modalId: id }, localVue, attachTo: div }
  );

  const modalWrapper = wrapper.findComponent(BaseIdModal);
  const modalId = modalWrapper.props('modalId');

  return {
    wrapper: modalWrapper,
    modalId,
    emitClose() {
      wrapper.vm.$x.emit('UserClickedCloseModal', modalId);
      return localVue.nextTick();
    },
    emitOpen() {
      wrapper.vm.$x.emit('UserClickedOpenModal', modalId);
      return localVue.nextTick();
    },
    clickBody() {
      document.body.click();
      return localVue.nextTick();
    },
    focusBody() {
      document.body.dispatchEvent(new FocusEvent('focusin'));
      return localVue.nextTick();
    },
    async clickOverlay() {
      await modalWrapper.trigger('click');
    },
    async clickModalContent() {
      await modalWrapper.get(getDataTestSelector('modal-content')).trigger('click');
    },
    getModalElement() {
      return modalWrapper.find(getDataTestSelector('modal'));
    }
  };
}

describe('testing BaseIdModal  component', () => {
  it('opens and closes when clicking on the open & close buttons', async () => {
    const { emitOpen, emitClose, getModalElement } = renderBaseIdModal();
    expect(getModalElement().exists()).toBe(false);

    await emitOpen();
    expect(getModalElement().exists()).toBe(true);
    await emitClose();
    expect(getModalElement().exists()).toBe(false);
  });

  it('closes when clicking on any element of the body', async () => {
    const { emitOpen, clickBody, getModalElement } = renderBaseIdModal();

    await emitOpen();
    expect(getModalElement().exists()).toBe(true);
    await clickBody();
    expect(getModalElement().exists()).toBe(false);
  });

  it('closes when focusing any other element out of the modal', async () => {
    const { emitOpen, focusBody, getModalElement } = renderBaseIdModal();

    await emitOpen();
    expect(getModalElement().exists()).toBe(true);
    await focusBody();
    expect(getModalElement().exists()).toBe(false);
  });

  it('closes when clicking the modal overlay', async () => {
    const { emitOpen, clickOverlay, getModalElement } = renderBaseIdModal();

    await emitOpen();
    expect(getModalElement().exists()).toBe(true);
    await clickOverlay();
    expect(getModalElement().exists()).toBe(false);
  });

  it("doesn't not close when clicking on either the modal or its content", async () => {
    const { wrapper, clickModalContent, emitOpen, getModalElement } = renderBaseIdModal({
      template: `
        <BaseIdModal modalId="myModal" v-bind="$attrs">
          <button data-test="test-button">Modal should still be open when I'm clicked</button>
        </BaseIdModal>`
    });

    await emitOpen();
    expect(getModalElement().exists()).toBe(true);

    await clickModalContent();
    expect(getModalElement().exists()).toBe(true);

    const button = wrapper.find(getDataTestSelector('test-button'));
    await button.trigger('click');
    expect(getModalElement().exists()).toBe(true);
  });
});

interface RenderBaseIdModalOptions {
  /** The template to render. */
  template?: string;
  /** The modal id. */
  id?: string;
}

interface RenderBaseIdModalAPI {
  /** The wrapper for the modal component. */
  wrapper: Wrapper<Vue>;
  /** The modal id. */
  modalId: string;
  /** Fakes a click on the close button. */
  emitClose: () => Promise<void>;
  /** Fakes a click on the open button. */
  emitOpen: () => Promise<void>;
  /** Fakes a click on the body. */
  clickBody: () => Promise<void>;
  /** Fakes a focusin event in the body. */
  focusBody: () => Promise<void>;
  /** Fakes a click on the overlay. */
  clickOverlay: () => Promise<void>;
  /** Fakes a click ont the modal content. */
  clickModalContent: () => Promise<void>;
  /** Retrieves the modal  wrapper. */
  getModalElement: () => Wrapper<Vue>;
}
