import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector } from '../../../__tests__/utils';
import { animationAbstractFactory } from '../animation.abstract-factory';

describe('testing animation abstract factory', () => {
  function renderAnimatedComponent(animationName: string): RenderApi {
    const wrapper = mount(
      {
        template: `
          <animationComponent>
            <div v-if="open" data-test="animation-content"></div>
          </animationComponent>
        `,
        components: {
          animationComponent: animationAbstractFactory(animationName)()
        },
        props: {
          open: { default: false }
        }
      },
      {}
    );

    return {
      toggleOpen(): void | Promise<void> {
        return wrapper.setProps({ open: true });
      },
      getContentWrapper(): Wrapper<Vue> {
        return wrapper.find(getDataTestSelector('animation-content'));
      },
      wrapper
    };
  }

  // eslint-disable-next-line max-len
  it('renders the animation component created by abstract factory.', async () => {
    const { wrapper, toggleOpen, getContentWrapper } = renderAnimatedComponent('my-animation');

    expect(wrapper.exists()).toBe(true);
    expect(getContentWrapper().exists()).toBe(false);

    await toggleOpen();

    expect(wrapper.exists()).toBe(true);
    expect(getContentWrapper().exists()).toBe(true);
  });
});

interface RenderApi {
  toggleOpen: () => void | Promise<void>;
  wrapper: Wrapper<Vue>;
  getContentWrapper: () => Wrapper<Vue>;
}
