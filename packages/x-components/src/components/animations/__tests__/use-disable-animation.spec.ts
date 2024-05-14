import { mount } from '@vue/test-utils';
import { defineComponent, provide } from 'vue';
import { DISABLE_ANIMATIONS_KEY } from '../../decorators/injection.consts';
import { useDisableAnimation } from '../use-disable-animation';

const Provider = defineComponent({
  props: {
    disableAnimation: Boolean
  },
  setup(props) {
    provide(DISABLE_ANIMATIONS_KEY as string, props.disableAnimation);
  },
  render(h) {
    return this.$slots.default?.[0] ?? h();
  }
});

/**
 * Animation component.
 */
const Animation = defineComponent({
  setup() {
    return useDisableAnimation('x-animation');
  },
  template: `
    <transition-group :name="name">
     <p>Animation</p>
    </transition-group>
  `
});

/**
 * Function that returns an Animation wrapper.
 *
 * @param disableAnimation - Flag to disable the animation.
 * @returns Animation wrapper.
 */
function renderDisableAnimation({ disableAnimation = true }: DisableAnimationOptions = {}) {
  const wrapper = mount({
    template: `
        <Provider :disableAnimation="disableAnimation">
          <Animation/>
        </Provider>
      `,
    components: { Provider, Animation },
    data() {
      return {
        disableAnimation
      };
    }
  });

  return {
    wrapper
  };
}

describe('testing disable animation', () => {
  it('should disable the animations', () => {
    const { wrapper } = renderDisableAnimation();

    expect(wrapper.attributes('name')).toBe('__no-animation__');
  });

  it('should enable the animations', () => {
    const { wrapper } = renderDisableAnimation({ disableAnimation: false });

    expect(wrapper.attributes('name')).toBe('x-animation');
  });
});

interface DisableAnimationOptions {
  /** Flag to disable the animation. */
  disableAnimation?: boolean;
}
