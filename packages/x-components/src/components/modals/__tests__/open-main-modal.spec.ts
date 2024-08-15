import { mount, VueWrapper } from '@vue/test-utils';
import Vue, { defineComponent } from 'vue';
import { AnyFunction } from '@empathyco/x-utils';
import { installNewXPlugin } from '../../../__tests__/utils';
import OpenMainModal from '../open-main-modal.vue';
import { XPlugin } from '../../../plugins/index';

/**
 * Renders the {@link OpenMainModal} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
function renderOpenMainModal({
  template = '<OpenMainModal />',
  methods
}: RenderOpenMainModalOptions = {}): RenderOpenMainModalAPI {
  const containerWrapper = defineComponent({
    components: {
      OpenMainModal
    },
    template,
    methods
  });

  const wrapper = mount(containerWrapper, {
    global: { plugins: [installNewXPlugin()] }
  });

  return {
    wrapper: wrapper.findComponent(OpenMainModal),
    async click() {
      await wrapper.trigger('click');
    }
  };
}

describe('testing Open Main Modal button component', () => {
  it('emits UserClickedOpenX by default when clicked', async () => {
    const { wrapper, click } = renderOpenMainModal();
    const onUserClickedOpenX = jest.fn();
    XPlugin.bus.on('UserClickedOpenX').subscribe(onUserClickedOpenX);

    await click();

    expect(onUserClickedOpenX).toHaveBeenCalledTimes(1);
  });

  it('renders the default slot contents', () => {
    const { wrapper } = renderOpenMainModal({
      template: '<OpenMainModal>Open</OpenMainModal>'
    });

    expect(wrapper.text()).toEqual('Open');
  });

  it('can be extended adding listeners', () => {
    const methods = {
      onClick: jest.fn()
    };
    const { click } = renderOpenMainModal({
      template: '<OpenMainModal @click="onClick">Open</OpenMainModal>',
      methods
    });
    click();
    expect(methods.onClick).toHaveBeenCalledTimes(1);
  });
});

interface RenderOpenMainModalOptions {
  /** The template to render. */
  template?: string;
  /** Additional methods to add to the testing template. */
  methods?: Record<string, AnyFunction>;
}

interface RenderOpenMainModalAPI {
  /** The wrapper for the modal component. */
  wrapper: VueWrapper;
  /** Clicks the button. */
  click: () => Promise<void>;
}
