import { mount, Wrapper } from '@vue/test-utils';
import { getDataTestSelector } from '../../__tests__/utils';
import AutoProgressBar from '../auto-progress-bar.vue';

function renderAutoProgressBar({
  template = '<AutoProgressBar :duration="duration" :isActive="isActive"/>',
  duration = 1
}: RenderBaseAutoProgressBarOptions = {}): RenderAutoProgressBarAPI {
  const wrapper = mount(
    {
      components: { AutoProgressBar },
      props: ['duration', 'isActive'],
      template
    },
    {
      propsData: {
        duration,
        isActive: true
      }
    }
  );

  return {
    wrapper
  };
}

describe('testing AutoProgressBar component', () => {
  it('renders a progress bar component', () => {
    const { wrapper } = renderAutoProgressBar();

    expect(wrapper.find(getDataTestSelector('progress-bar')).exists()).toBe(true);
  });

  it('renders a progress bar component with a custom slot content', () => {
    const { wrapper } = renderAutoProgressBar({
      template: `
        <span data-test="custom">Running out in {{duration}} second</span>
      `
    });

    expect(wrapper.find(getDataTestSelector('custom')).text()).toBe('Running out in 1 second');
  });

  it("doesn't render a progress bar component when is not active", async () => {
    const { wrapper } = renderAutoProgressBar();

    expect(wrapper.find(getDataTestSelector('progress-bar')).exists()).toBe(true);

    await wrapper.setProps({ isActive: false });

    expect(wrapper.find(getDataTestSelector('progress-bar')).exists()).toBe(false);
  });

  it('render a progress bar component with an animation', () => {
    const { wrapper } = renderAutoProgressBar({ duration: 5 });

    expect(wrapper.find(getDataTestSelector('progress-bar__line')).attributes().style).toBe(
      'animation-duration: 5s;'
    );
  });
});

/**
 * Options to configure how the progress bar component should be rendered.
 */
interface RenderBaseAutoProgressBarOptions {
  template?: string;
  duration?: number;
}

/**
 * Options to configure how the progress bar component should be rendered.
 */
interface RenderAutoProgressBarAPI {
  /** The wrapper for the progress bar component. */
  wrapper: Wrapper<Vue>;
}
