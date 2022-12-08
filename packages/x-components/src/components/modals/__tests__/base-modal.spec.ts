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
  open = false,
  focusOnOpen = true
}: MountBaseModalOptions = {}): MountBaseModalAPI {
  const localVue = createLocalVue();
  const wrapper = mount(BaseModal, {
    localVue,
    propsData: {
      open,
      focusOnOpen
    },
    slots: {
      default: defaultSlot
    }
  });
  const appendToBody = (): void => {
    document.body.appendChild(wrapper.element);
  };

  return {
    wrapper,
    getModalContent() {
      return wrapper.find(getDataTestSelector('modal-content'));
    },
    async setOpen(open) {
      await wrapper.setProps({ open });
    },
    async closeModal() {
      await wrapper.find(getDataTestSelector('modal-overlay'))?.trigger('click');
    },
    appendToBody,
    async fakeFocusIn() {
      const buttonWrapper = mount({
        template: `<button>Button</button>`
      });
      appendToBody();
      document.body.appendChild(buttonWrapper.element);
      await buttonWrapper.trigger('focusin');
    }
  };
}

describe('testing Base Modal  component', () => {
  it('renders only when the open prop is set to true', async () => {
    const { getModalContent, setOpen } = mountBaseModal();

    expect(getModalContent().exists()).toBe(false);

    await setOpen(true);
    expect(getModalContent().exists()).toBe(true);
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

  it('changes the focus to the correct element when the modal opens', async () => {
    let { wrapper, setOpen, appendToBody } = mountBaseModal({
      defaultSlot: `<div>
          <button data-test="expected-focus">First button</button>
          <button>Second button</button>
        </div>`,
      open: false
    });

    appendToBody();
    await setOpen(true);

    expect(wrapper.find(getDataTestSelector('expected-focus')).element).toBe(
      document.activeElement
    );

    ({ wrapper, setOpen, appendToBody } = mountBaseModal({
      defaultSlot: `<div>
          <button>First button</button>
          <button tabindex="1" data-test="expected-focus">Second button</button>
        </div>`,
      open: false
    }));

    appendToBody();
    await setOpen(true);

    expect(wrapper.find(getDataTestSelector('expected-focus')).element).toBe(
      document.activeElement
    );
  });

  it("doesn't change the focus if the focusOnOpen prop is false", async () => {
    const { setOpen, appendToBody } = mountBaseModal({
      defaultSlot: `<div>
          <button tabindex="1">First button</button>
          <button>Second button</button>
        </div>`,
      open: false,
      focusOnOpen: false
    });

    appendToBody();
    const focusedElementBeforeOpen = document.activeElement;
    await setOpen(true);

    expect(focusedElementBeforeOpen).toBe(document.activeElement);
  });
});

interface MountBaseModalOptions {
  /** The default slot to render. */
  defaultSlot?: string;
  /** Events that when emitted should open the modal. */
  open?: boolean;
  /** Indicates if the focus changes to an element inside the modal when it opens. */
  focusOnOpen?: boolean;
}

interface MountBaseModalAPI {
  /** The wrapper for the modal component. */
  wrapper: Wrapper<Vue>;
  /** Fakes a click on the close button. */
  setOpen: (open: boolean) => Promise<void>;
  /** Retrieves the modal container wrapper. */
  getModalContent: () => Wrapper<Vue>;
  /** Fakes a click on the modal close. */
  closeModal: () => Promise<void>;
  /** Appends the component's element the body. */
  appendToBody: () => void;
  /** Fakes a focusin event in another HTMLElement of the body. */
  fakeFocusIn: () => Promise<void>;
}
