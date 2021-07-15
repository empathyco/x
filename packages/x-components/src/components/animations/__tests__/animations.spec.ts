import { mount } from '@vue/test-utils';
import FadeAndSlide from '../fade-and-slide.vue';

describe('testing Fade and Slide component', () => {
  it('renders the animation component with the expected tag wrapping all slotted elements', () => {
    const fadeAndSlideComponent = {
      template: `
        <FadeAndSlide tag="div">
          <p key="1">Fist paragraph</p>
          <p key="2">Second paragraph</p>
          <p key="3">Third paragraph</p>
        </FadeAndSlide>
      `,
      components: {
        FadeAndSlide
      }
    };

    const fadeAndSlideWrapper = mount(fadeAndSlideComponent);

    expect(fadeAndSlideWrapper.find('div')).toBeTruthy();
    expect(fadeAndSlideWrapper.findAll('p')).toHaveLength(3);
  });
});
