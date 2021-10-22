import { mount, Wrapper } from '@vue/test-utils';
import { getDataTestSelector } from '../../__tests__/utils';
import AutoProgressBar from '../auto-progress-bar.vue';

function renderAutoProgressBar({
  template = '<AutoProgressBar :duration="duration" :isLoading="isLoading"/>',
  duration = 1,
  isLoading = true
}: RenderBaseAutoProgressBarOptions = {}): RenderAutoProgressBarAPI {
  const wrapper = mount(
    {
      components: { AutoProgressBar },
      template
    },
    {
      data() {
        return {
          duration,
          isLoading
        };
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

  it("doesn't render a progress bar component when is not active", async () => {
    const { wrapper } = renderAutoProgressBar();

    expect(wrapper.find(getDataTestSelector('progress-bar')).exists()).toBe(true);

    await wrapper.setData({ isLoading: false });

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
  /** The template to render.*/
  template?: string;
  /** The duration of the animation. */
  duration?: number;
  /** A flag indicating if the progress bar is loading. */
  isLoading?: boolean;
}

/**
 * Options to configure how the progress bar component should be rendered.
 */
interface RenderAutoProgressBarAPI {
  /** The wrapper for the progress bar component. */
  wrapper: Wrapper<Vue>;
}
