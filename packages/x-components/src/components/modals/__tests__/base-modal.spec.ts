import { mount } from '@vue/test-utils';
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
  focusOnOpen = true,
  contentClass = '',
  overlayClass = ''
} = {}) {
  const wrapper = mount(
    {
      template: `
        <BaseModal
          :open="open"
          :focusOnOpen="focusOnOpen"
          :contentClass="contentClass"
          :overlayClass="overlayClass"
        >
          <slot/>
        </BaseModal>`,
      components: { BaseModal },
      props: ['open', 'focusOnOpen', 'contentClass', 'overlayClass']
    },
    {
      propsData: { open, focusOnOpen, contentClass, overlayClass },
      slots: { default: defaultSlot }
    }
  );

  const baseModalWrapper = wrapper.findComponent(BaseModal);
  const appendToBody = () => document.body.appendChild(wrapper.element);

  return {
    wrapper: baseModalWrapper,
    getModalContent: () => baseModalWrapper.find(getDataTestSelector('modal-content')),
    setOpen: async (open: boolean) => await wrapper.setProps({ open }),
    closeModal: async () =>
      await baseModalWrapper.find(getDataTestSelector('modal-overlay'))?.trigger('click'),
    appendToBody,
    fakeFocusIn: async () => {
      const buttonWrapper = mount({ template: `<button>Button</button>` });
      appendToBody();
      document.body.appendChild(buttonWrapper.element);
      jest.runAllTimers();
      await buttonWrapper.trigger('focusin');
    }
  } as const;
}

describe('testing Base Modal  component', () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

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

    expect(wrapper.find(getDataTestSelector('default-slot-overridden')).exists()).toBeTruthy();
  });

  it('changes the focus to the correct element when the modal opens', async () => {
    const dataTestSelector = 'expected-focus';
    let { wrapper, setOpen, appendToBody } = mountBaseModal({
      defaultSlot: `
        <div>
          <button data-test="${dataTestSelector}">First button</button>
          <button>Second button</button>
        </div>`,
      open: false
    });

    appendToBody();
    await setOpen(true);

    expect(wrapper.find(getDataTestSelector(dataTestSelector)).element).toEqual(
      document.activeElement
    );

    ({ wrapper, setOpen, appendToBody } = mountBaseModal({
      defaultSlot: `
        <div>
          <button>First button</button>
          <button tabindex="1" data-test="${dataTestSelector}">Second button</button>
        </div>`,
      open: false
    }));

    appendToBody();
    await setOpen(true);

    expect(wrapper.find(getDataTestSelector(dataTestSelector)).element).toEqual(
      document.activeElement
    );
  });

  it("doesn't change the focus if the focusOnOpen prop is false", async () => {
    const { setOpen, appendToBody } = mountBaseModal({
      defaultSlot: `
        <div>
          <button tabindex="1">First button</button>
          <button>Second button</button>
        </div>`,
      open: false,
      focusOnOpen: false
    });

    appendToBody();
    const focusedElementBeforeOpen = document.activeElement;
    await setOpen(true);

    expect(focusedElementBeforeOpen).toEqual(document.activeElement);
  });

  it('allows adding classes to the modal content', () => {
    const { getModalContent } = mountBaseModal({
      contentClass: 'test-class',
      open: true
    });

    expect(getModalContent().classes()).toContain('test-class');
  });

  it('allows adding classes to the modal overlay', () => {
    const { wrapper } = mountBaseModal({
      overlayClass: 'custom-class',
      open: true
    });

    const overlay = wrapper.find(getDataTestSelector('modal-overlay'));
    expect(overlay.classes('custom-class')).toBeTruthy();
  });
});
