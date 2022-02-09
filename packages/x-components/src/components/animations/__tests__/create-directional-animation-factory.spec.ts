import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { getDataTestSelector } from '../../../__tests__/utils';
import { createDirectionalAnimationFactory } from '../create-directional-animation-factory';

describe('testing animation abstract factory', () => {
  function renderAnimatedComponent(animationName: string): RenderApi {
    const wrapper = mount(
      {
        template: `
          <animationComponent data-test="animation-component">
            <div v-if="open" data-test="animation-content"></div>
          </animationComponent>
        `,
        components: {
          animationComponent: createDirectionalAnimationFactory(animationName)()
        },
        props: {
          open: { default: false }
        }
      },
      {}
    );

    return {
      open(): void | Promise<void> {
        return wrapper.setProps({ open: true });
      },
      getContentWrapper(): Wrapper<Vue> {
        return wrapper.find(getDataTestSelector('animation-content'));
      }
    };
  }

  it('renders the slots content.', async () => {
    const { open, getContentWrapper } = renderAnimatedComponent('my-animation');

    expect(getContentWrapper().exists()).toBe(false);
    await open();
    expect(getContentWrapper().exists()).toBe(true);
  });
});

interface RenderApi {
  open: () => void | Promise<void>;
  getContentWrapper: () => Wrapper<Vue>;
}
