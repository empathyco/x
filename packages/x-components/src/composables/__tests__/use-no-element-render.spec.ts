import Vue, { ComponentOptions, defineComponent } from 'vue';
import { mount, Wrapper } from '@vue/test-utils';
import { Dictionary } from '@empathyco/x-utils';
import { useNoElementRender } from '../use-no-element-render';
import { getDataTestSelector } from '../../__tests__/utils';

const renderUseNoElementRender = ({
  slots,
  component
}: RenderUseNoElementRenderOptions = {}): Wrapper<Vue> => {
  const wrapper = mount(
    component ??
      (defineComponent({
        setup(props, { slots }) {
          return () => useNoElementRender(slots);
        }
      }) as ComponentOptions<Vue>),
    {
      slots
    }
  );

  return wrapper;
};

describe('testing useNoElementRender composable', () => {
  it('renders as empty if there are no slots', () => {
    let wrapper = renderUseNoElementRender();

    expect(wrapper.html()).toBe('');

    wrapper = renderUseNoElementRender({
      slots: {
        nonDefault: '<div data-test="non-default-slot"></div>'
      }
    });

    expect(wrapper.html()).toBe('');
  });

  it('renders the default slot if there is any', () => {
    const wrapper = renderUseNoElementRender({
      slots: {
        default: '<div data-test="default-slot"></div>',
        nonDefault: '<div data-test="non-default-slot"></div>'
      }
    });

    expect(wrapper.find(getDataTestSelector('default-slot')).exists()).toBe(true);
  });

  it('also works from the `setup` function', () => {
    const component = defineComponent({
      setup(_, { slots }) {
        return () => useNoElementRender(slots);
      }
    });

    let wrapper = renderUseNoElementRender({
      component
    });

    expect(wrapper.html()).toBe('');

    wrapper = renderUseNoElementRender({
      slots: {
        default: '<div data-test="default-slot"></div>'
      },
      component
    });

    expect(wrapper.find(getDataTestSelector('default-slot')).exists()).toBe(true);
  });
});

type RenderUseNoElementRenderOptions = {
  slots?: Dictionary<string>;
  component?: ComponentOptions<Vue>;
};
