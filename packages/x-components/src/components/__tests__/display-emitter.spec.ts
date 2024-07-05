import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { useEmitDisplayEvent } from '../../composables/use-on-display';
import DisplayEmitter from '../display-emitter.vue';
import { getDataTestSelector } from '../../__tests__/utils';
import { getXComponentXModuleName, isXComponent } from '../x-component.utils';

jest.mock('../../composables/use-on-display', () => ({
  useEmitDisplayEvent: jest.fn()
}));
const unwatchDisplaySpy = jest.fn();
(useEmitDisplayEvent as jest.Mock).mockReturnValue({ unwatchDisplay: unwatchDisplaySpy });

function render({
  payload = { url: 'tagging/url', params: { test: 'param' } },
  eventMetadata = { test: 'param' }
} = {}) {
  const wrapper = mount({
    components: { DisplayEmitter },
    template: `
      <DisplayEmitter :payload="payload" :eventMetadata="eventMetadata">
        <div data-test="child" />
      </DisplayEmitter>`,
    data: () => ({ payload, eventMetadata })
  });

  return {
    wrapper: wrapper.findComponent(DisplayEmitter),
    element: wrapper.find(getDataTestSelector('child')).element,
    payload,
    eventMetadata
  };
}

describe('testing DisplayEmitter component', () => {
  beforeEach(() => {
    (useEmitDisplayEvent as jest.Mock).mockClear();
    unwatchDisplaySpy.mockClear();
  });

  it('is an XComponent which has an XModule', () => {
    const { wrapper } = render();

    expect(isXComponent(wrapper.vm)).toBeTruthy();
    expect(getXComponentXModuleName(wrapper.vm)).toEqual('tagging');
  });

  it('renders everything passed to its default slot', () => {
    const { wrapper } = render();

    expect(wrapper.find(getDataTestSelector('child')).exists()).toBeTruthy();
  });

  it('executes `useEmitDisplayEvent` composable underneath', () => {
    render();

    expect(useEmitDisplayEvent).toHaveBeenCalled();
  });

  it('provides `useEmitDisplayEvent` with the element in the slot to watch', async () => {
    const { element } = render();

    await nextTick();

    expect(useEmitDisplayEvent).toHaveBeenCalledWith(expect.objectContaining({ element }));
  });

  it('provides `useEmitDisplayEvent` with the payload and metadata to emit with the display event', async () => {
    const { payload, eventMetadata } = render();

    await nextTick();

    expect(useEmitDisplayEvent).toHaveBeenCalledWith(
      expect.objectContaining({ taggingRequest: payload, eventMetadata })
    );
  });

  it('removes the watcher on unmount', async () => {
    const { wrapper } = render();

    wrapper.destroy();
    await nextTick();

    expect(unwatchDisplaySpy).toHaveBeenCalled();
  });
});
