import { mount, Wrapper } from '@vue/test-utils';
import { Component, Prop } from 'vue-property-decorator';
import Vue, { ComponentOptions, CreateElement, VNode } from 'vue';
import DisableAnimationMixin from '../disable-animation.mixin';
import { XProvide } from '../../decorators/injection.decorators';
import { DISABLE_ANIMATIONS_KEY } from '../../decorators/injection.consts';

@Component
class Provider extends Vue {
  @Prop()
  @XProvide(DISABLE_ANIMATIONS_KEY)
  public disableAnimation!: boolean;

  render(h: CreateElement): VNode {
    return this.$slots.default?.[0] ?? h();
  }
}

/**
 * Animation component.
 */
const Animation: ComponentOptions<Vue> = {
  mixins: [DisableAnimationMixin],
  template: `
    <transition-group :name="name">
     <p>Animation</p>
    </transition-group>
  `,
  data() {
    return {
      animationName: 'x-animation'
    };
  }
};

/**
 * Function that returns an Animation wrapper.
 *
 * @param disableAnimation - Flag to disable the animation.
 * @returns Animation wrapper.
 */
function renderDisableAnimation({
  disableAnimation = true
}: DisableAnimationOptions = {}): DisableAnimationAPI {
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

interface DisableAnimationAPI {
  /** The wrapper of the mounted component. */
  wrapper: Wrapper<Vue>;
}
