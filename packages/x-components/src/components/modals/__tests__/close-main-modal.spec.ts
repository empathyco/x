import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { AnyFunction } from '@empathyco/x-utils';
import { installNewXPlugin } from '../../../__tests__/utils';
import CloseMainModal from '../close-main-modal.vue';

/**
 * Renders the {@link CloseMainModal} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
function renderCloseXModal({
  template = '<CloseMainModal />',
  methods
}: RenderCloseXModalOptions = {}): RenderCloseXModalAPI {
  const [, localVue] = installNewXPlugin();
  const containerWrapper = mount(
    {
      components: {
        CloseMainModal
      },
      template,
      methods
    },
    { localVue }
  );

  const wrapper = containerWrapper.findComponent(CloseMainModal);

  return {
    wrapper,
    async click() {
      await wrapper.trigger('click');
    }
  };
}

describe('testing Close X Modal button component', () => {
  it('emits UserClickedCloseX by default when clicked', async () => {
    const { wrapper, click } = renderCloseXModal();
    const onUserClickedCloseX = jest.fn();
    wrapper.vm.$x.on('UserClickedCloseX').subscribe(onUserClickedCloseX);

    await click();

    expect(onUserClickedCloseX).toHaveBeenCalledTimes(1);
  });

  it('renders the default slot contents', () => {
    const { wrapper } = renderCloseXModal({
      template: '<CloseMainModal>Close</CloseMainModal>'
    });

    expect(wrapper.text()).toEqual('Close');
  });

  it('can be extended adding listeners', () => {
    const methods = {
      onClick: jest.fn()
    };
    const { click } = renderCloseXModal({
      template: '<CloseMainModal @click="onClick">Close</CloseMainModal>',
      methods
    });
    click();
    expect(methods.onClick).toHaveBeenCalledTimes(1);
  });
});

interface RenderCloseXModalOptions {
  /** The template to render. */
  template?: string;
  /** Additional methods to add to the testing template. */
  methods?: Record<string, AnyFunction>;
}

interface RenderCloseXModalAPI {
  /** The wrapper for the modal component. */
  wrapper: Wrapper<Vue>;
  /** Clicks the button. */
  click: () => Promise<void>;
}
