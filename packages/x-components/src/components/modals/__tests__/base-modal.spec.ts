import { createLocalVue, mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector } from '../../../__tests__/utils';
import BaseModal from '../base-modal.vue';

/**
 * Renders the {@link BaseModal} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
function renderBaseModal({
  template = '<BaseModal v-bind="$attrs"/>',
  open = true
}: RenderBaseModalOptions = {}): RenderBaseModalAPI {
  const localVue = createLocalVue();
  const containerWrapper = mount(
    {
      components: {
        BaseModal
      },
      template
    },
    { propsData: { open }, localVue }
  );

  const wrapper = containerWrapper.findComponent(BaseModal);

  return {
    wrapper,
    getModal() {
      return wrapper.find(getDataTestSelector('modal'));
    },
    async setOpen(open) {
      await containerWrapper.setProps({ open });
    },
    async clickBody() {
      document.body.click();
      await localVue.nextTick();
    }
  };
}

describe('testing Base Modal  component', () => {
  it('renders only when the open prop is set to true', async () => {
    const { getModal, setOpen } = renderBaseModal({ open: false });

    expect(getModal().exists()).toBe(false);

    await setOpen(true);
    expect(getModal().exists()).toBe(true);
  });

  it('renders the content when is open', () => {
    const { wrapper } = renderBaseModal({
      template: `
        <BaseModal v-bind="$attrs">
          <div data-test="test-contents">
            <p>Yeah, estoy subiendo como espuma</p>
            <p>Prendiendole en la cara al que no fuma</p>
          </div>
        </BaseModal>`,
      open: true
    });

    const contents = wrapper.find(getDataTestSelector('test-contents'));
    expect(contents.exists()).toBe(true);
  });

  it('emits the click:body event when the body is clicked only if the modal is open', async () => {
    const { wrapper, clickBody, setOpen } = renderBaseModal({ open: false });

    await clickBody();
    expect(wrapper.emitted('click:body')).toBeUndefined();

    await setOpen(true);
    await clickBody();

    expect(wrapper.emitted('click:body')).toEqual([[expect.any(MouseEvent)]]);
  });
});

interface RenderBaseModalOptions {
  /** The template to render. */
  template?: string;
  /** Events that when emitted should open the modal. */
  open?: boolean;
}

interface RenderBaseModalAPI {
  /** The wrapper for the modal component. */
  wrapper: Wrapper<Vue>;
  /** Fakes a click on the close button. */
  setOpen: (open: boolean) => Promise<void>;
  /** Retrieves the modal container wrapper. */
  getModal: () => Wrapper<Vue>;
  /** Fakes a click on the body. */
  clickBody: () => Promise<void>;
}
