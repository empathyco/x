import { mount } from '@vue/test-utils';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseIdModalOpen from '../base-id-modal-open.vue';
import { bus } from '../../../plugins/x-bus';
import { dummyCreateEmitter } from '../../../__tests__/bus.dummy';
import { XPlugin } from '../../../plugins/index';

/**
 * Renders the {@link BaseIdModalOpen} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
function renderBaseIdModalOpen({
  template = `<BaseIdModalOpen :modalId="modalId" v-bind="$attrs"/>`
} = {}) {
  // Making bus not repeat subjects
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  jest.spyOn(bus, 'createEmitter' as any).mockImplementation(dummyCreateEmitter.bind(bus) as any);

  const modalId = 'myModal';

  const containerWrapper = mount(
    {
      components: { BaseIdModalOpen },
      template
    },
    {
      props: { modalId },
      global: { plugins: [installNewXPlugin()] }
    }
  );

  const wrapper = containerWrapper.findComponent(BaseIdModalOpen);

  return {
    wrapper,
    modalId,
    click: async () => await wrapper.trigger('click')
  };
}

describe('testing Open Button component', () => {
  it("emits UserClickedOpenModal with the component's id as payload", async () => {
    const { modalId, click } = renderBaseIdModalOpen();
    const listener = jest.fn();
    XPlugin.bus.on('UserClickedOpenModal').subscribe(listener);

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

  it('renders custom content replacing the default exposing the function that opens the modal', async () => {
    const { wrapper, click, modalId } = renderBaseIdModalOpen({
      template: `
        <BaseIdModalOpen modalId="modal" v-bind="$attrs">
          <template #opening-element="{ openModal }">
            <div>
              Open <span data-test="custom-open-modal" @click="openModal">HERE</span>
            </div>
          </template>
        </BaseIdModalOpen>`
    });

    const listener = jest.fn();
    XPlugin.bus.on('UserClickedOpenModal').subscribe(listener);

    await click();

    expect(listener).toHaveBeenCalledTimes(0);

    await wrapper.find(getDataTestSelector('custom-open-modal')).trigger('click');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(modalId);
  });
});
