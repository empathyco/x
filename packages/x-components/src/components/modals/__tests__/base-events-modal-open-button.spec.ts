import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { installNewXPlugin } from '../../../__tests__/utils';
import { XEvent } from '../../../wiring/events.types';
import BaseEventsModalOpen from '../base-events-modal-open.vue';

/**
 * Renders the {@link BaseEventsModalOpen} with the provided options.
 *
 * @param options - The options to render the component with.
 * @returns An small API to test the component.
 */
function renderBaseEventsModalOpen({
  template = '<BaseEventsModalOpen v-bind="$attrs"/>',
  openingEvent
}: RenderBaseEventsModalOpenOptions = {}): RenderBaseEventsModalOpenAPI {
  const [, localVue] = installNewXPlugin();
  const containerWrapper = mount(
    {
      components: {
        BaseEventsModalOpen
      },
      template
    },
    { propsData: { openingEvent }, localVue }
  );

  const wrapper = containerWrapper.findComponent(BaseEventsModalOpen);

  return {
    wrapper,
    async click() {
      wrapper.trigger('click');
      await localVue.nextTick();
    }
  };
}

describe('testing Open Button component', () => {
  it('emits UserClickedOpenX by default when clicked', async () => {
    const { wrapper, click } = renderBaseEventsModalOpen();
    const listener = jest.fn();
    wrapper.vm.$x.on('UserClickedOpenX').subscribe(listener);

    await click();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('emits the defined openingEvent when clicked', async () => {
    const { wrapper, click } = renderBaseEventsModalOpen({
      openingEvent: 'UserClickedAFilter'
    });
    const listener = jest.fn();
    wrapper.vm.$x.on('UserClickedAFilter').subscribe(listener);

    await click();

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('renders the default slot contents', () => {
    const { wrapper } = renderBaseEventsModalOpen({
      template: '<BaseEventsModalOpen v-bind="$attrs">Open</BaseEventsModalOpen>'
    });

    expect(wrapper.text()).toEqual('Open');
  });
});

interface RenderBaseEventsModalOpenOptions {
  /** The template to render. */
  template?: string;
  /** Event that should be emitted when the button is clicked. */
  openingEvent?: XEvent;
}

interface RenderBaseEventsModalOpenAPI {
  /** The wrapper for the modal component. */
  wrapper: Wrapper<Vue>;
  /** Clicks the button. */
  click: () => Promise<void>;
}
