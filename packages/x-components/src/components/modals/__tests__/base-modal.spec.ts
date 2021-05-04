import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseModal from '../base-modal.vue';

/**
 * Mounts a {@link BaseModal} component with the provided options and offers an API to easily
 * test it.
 *
 * @param options - The options to render the component with.
 * @returns An API to test the component.
 */
function mountBaseModal({
  defaultSlot = '<span data-test="default-slot">Modal</span>',
  open = false
}: MountBaseModalOptions = {}): MountBaseModalAPI {
  const localVue = createLocalVue();
  const wrapper = mount(BaseModal, {
    localVue,
    propsData: {
      open
    },
    slots: {
      default: defaultSlot
    }
  });

  return {
    wrapper,
    getModal() {
      return wrapper.find(getDataTestSelector('modal'));
    },
    async setOpen(open) {
      await wrapper.setProps({ open });
    },
    async closeModal() {
      await wrapper.find(getDataTestSelector('modal-overlay'))?.trigger('click');
    },
    async fakeFocusIn() {
      const buttonWrapper = mount({
        template: `<button>Button</button>`
      });
      document.body.appendChild(wrapper.element);
      document.body.appendChild(buttonWrapper.element);
      await buttonWrapper.trigger('focusin');
    }
  };
}

describe('testing Base Modal  component', () => {
  it('renders only when the open prop is set to true', async () => {
    const { getModal, setOpen } = mountBaseModal();

    expect(getModal().exists()).toBe(false);

    await setOpen(true);
    expect(getModal().exists()).toBe(true);
  });

  it("emits click:body event when clicking outside modal's content if it is opened", async () => {
    const { wrapper, closeModal, setOpen } = mountBaseModal();

    expect(wrapper.emitted('click:overlay')).toBeUndefined();

    await setOpen(true);
    await closeModal();

    expect(wrapper.emitted('click:overlay')).toEqual([[expect.any(MouseEvent)]]);
  });

  it('emits the focusin:body event any element out of the modal is focused', async () => {
    const { wrapper, fakeFocusIn, setOpen } = mountBaseModal();

    expect(wrapper.emitted('focusin:body')).toBeUndefined();

    await setOpen(true);
    await fakeFocusIn();

    expect(wrapper.emitted('focusin:body')).toEqual([[expect.any(FocusEvent)]]);
  });

  it('allows customizing the default slot content', () => {
    const { wrapper } = mountBaseModal({
      defaultSlot: `<span data-test="default-slot-overridden">Custom content</span>`,
      open: true
    });

    expect(wrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toBe(true);
  });
});

interface MountBaseModalOptions {
  /** The default slot to render. */
  defaultSlot?: string;
  /** Events that when emitted should open the modal. */
  open?: boolean;
}

interface MountBaseModalAPI {
  /** The wrapper for the modal component. */
  wrapper: Wrapper<Vue>;
  /** Fakes a click on the close button. */
  setOpen: (open: boolean) => Promise<void>;
  /** Retrieves the modal container wrapper. */
  getModal: () => Wrapper<Vue>;
  /** Fakes a click on the modal close. */
  closeModal: () => Promise<void>;
  /** Fakes a focusin event in another HTMLElement of the body. */
  fakeFocusIn: () => Promise<void>;
}
