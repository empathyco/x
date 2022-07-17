import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { AnyFunction } from '@empathyco/x-utils';
import { installNewXPlugin } from '../../../__tests__/utils';
import OpenXModal from '../open-x-modal.vue';

/**
 * Renders the {@link OpenXModal} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
function renderOpenXModal({
  template = '<OpenXModal />',
  methods
}: RenderOpenXModalOptions = {}): RenderOpenXModalAPI {
  const [, localVue] = installNewXPlugin();
  const containerWrapper = mount(
    {
      components: {
        OpenXModal
      },
      template,
      methods
    },
    { localVue }
  );

  const wrapper = containerWrapper.findComponent(OpenXModal);

  return {
    wrapper,
    async click() {
      await wrapper.trigger('click');
    }
  };
}

describe('testing Open X Modal button component', () => {
  it('emits UserClickedOpenX by default when clicked', async () => {
    const { wrapper, click } = renderOpenXModal();
    const onUserClickedOpenX = jest.fn();
    wrapper.vm.$x.on('UserClickedOpenX').subscribe(onUserClickedOpenX);

    await click();

    expect(onUserClickedOpenX).toHaveBeenCalledTimes(1);
  });

  it('renders the default slot contents', () => {
    const { wrapper } = renderOpenXModal({
      template: '<OpenXModal>Open</OpenXModal>'
    });

    expect(wrapper.text()).toEqual('Open');
  });

  it('can be extended adding listeners', () => {
    const methods = {
      onClick: jest.fn()
    };
    const { click } = renderOpenXModal({
      template: '<OpenXModal @click="onClick">Open</OpenXModal>',
      methods
    });
    click();
    expect(methods.onClick).toHaveBeenCalledTimes(1);
  });
});

interface RenderOpenXModalOptions {
  /** The template to render. */
  template?: string;
  /** Additional methods to add to the testing template. */
  methods?: Record<string, AnyFunction>;
}

interface RenderOpenXModalAPI {
  /** The wrapper for the modal component. */
  wrapper: Wrapper<Vue>;
  /** Clicks the button. */
  click: () => Promise<void>;
}
