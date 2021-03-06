import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../__tests__/utils';
import BaseIdModalOpen from '../base-id-modal-open.vue';

/**
 * Renders the {@link BaseIdModalOpen} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
function renderBaseIdModalOpen({
  id = 'myModal',
  template = `<BaseIdModalOpen modalId="${id}" v-bind="$attrs"/>`
}: RenderBaseIdModalOpenOptions = {}): RenderBaseIdModalOpenAPI {
  const [, localVue] = installNewXPlugin();
  const containerWrapper = mount(
    {
      components: {
        BaseIdModalOpen
      },
      template
    },
    { propsData: { modalId: id }, localVue }
  );

  const wrapper = containerWrapper.findComponent(BaseIdModalOpen);
  const modalId = wrapper.props('modalId');

  return {
    wrapper,
    modalId,
    async click() {
      await wrapper.trigger('click');
    }
  };
}

describe('testing Open Button component', () => {
  it("emits UserClickedOpenModal with the component's id as payload", async () => {
    const { wrapper, modalId, click } = renderBaseIdModalOpen();
    const listener = jest.fn();
    wrapper.vm.$x.on('UserClickedOpenModal').subscribe(listener);

    await click();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(modalId);
  });

  it('renders the default slot contents', () => {
    const { wrapper } = renderBaseIdModalOpen({
      template: '<BaseIdModalOpen modalId="modal" v-bind="$attrs">Open</BaseIdModalOpen>'
    });

    expect(wrapper.text()).toEqual('Open');
  });
});

interface RenderBaseIdModalOpenOptions {
  /** Id of the modal to open. */
  id?: string;
  /** The template to render. */
  template?: string;
}

interface RenderBaseIdModalOpenAPI {
  /** The wrapper for the modal component. */
  wrapper: Wrapper<Vue>;
  /** The modal id. */
  modalId: string;
  /** Clicks the button. */
  click: () => Promise<void>;
}
