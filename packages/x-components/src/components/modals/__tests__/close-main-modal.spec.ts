import { mount, VueWrapper } from '@vue/test-utils';
import Vue, { defineComponent } from 'vue';
import { AnyFunction } from '@empathyco/x-utils';
import { installNewXPlugin } from '../../../__tests__/utils';
import CloseMainModal from '../close-main-modal.vue';
import { XPlugin } from '../../../plugins/index';

/**
 * Renders the {@link CloseMainModal} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
function renderCloseMainModal({
  template = '<CloseMainModal />',
  methods
}: RenderCloseMainModalOptions = {}): RenderCloseMainModalAPI {
  const containerWrapper = defineComponent({
    components: {
      CloseMainModal
    },

    template,
    methods
  });
  const wrapper = mount(containerWrapper, {
    global: { plugins: [installNewXPlugin()] }
  });

  return {
    wrapper: wrapper.findComponent(CloseMainModal),
    async click() {
      await wrapper.trigger('click');
    }
  };
}

describe('testing Close Main Modal button component', () => {
  it('emits UserClickedCloseX by default when clicked', async () => {
    const { wrapper, click } = renderCloseMainModal();
    const onUserClickedCloseX = jest.fn();
    XPlugin.bus.on('UserClickedCloseX').subscribe(onUserClickedCloseX);

    await click();

    expect(onUserClickedCloseX).toHaveBeenCalledTimes(1);
  });

  it('renders the default slot contents', () => {
    const { wrapper } = renderCloseMainModal({
      template: '<CloseMainModal>Close</CloseMainModal>'
    });

    expect(wrapper.text()).toEqual('Close');
  });

  it('can be extended adding listeners', () => {
    const methods = {
      onClick: jest.fn()
    };
    const { click } = renderCloseMainModal({
      template: '<CloseMainModal @click="onClick">Close</CloseMainModal>',
      methods
    });
    click();
    expect(methods.onClick).toHaveBeenCalledTimes(1);
  });
});

interface RenderCloseMainModalOptions {
  /** The template to render. */
  template?: string;
  /** Additional methods to add to the testing template. */
  methods?: Record<string, AnyFunction>;
}

interface RenderCloseMainModalAPI {
  /** The wrapper for the modal component. */
  wrapper: VueWrapper;
  /** Clicks the button. */
  click: () => Promise<void>;
}
