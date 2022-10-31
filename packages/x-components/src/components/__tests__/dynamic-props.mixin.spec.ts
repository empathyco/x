import Vue from 'vue';
import { mount, Wrapper } from '@vue/test-utils';
import { dynamicPropsMixin } from '../dynamic-props.mixin';

const renderComponent = ({ props = ['list', 'button'] }: ComponentOptions = {}): ComponentAPI => {
  const wrapper = mount({
    mixins: [dynamicPropsMixin(props)],
    render: h => h(),
    props: ['data']
  });
  return { wrapper };
};

describe('dynamicPropsMixin', () => {
  it('expects to have the defined props from the mixin', () => {
    const { wrapper } = renderComponent();
    const props = Object.keys(wrapper.props());
    expect(props).toEqual(['list', 'button', 'data']);
  });
});

/**
 * The options for the `renderComponent` function.
 */
interface ComponentOptions {
  props?: string[];
}

/**
 * Test API for the component.
 */
interface ComponentAPI {
  /** The wrapper for the component. */
  wrapper: Wrapper<Vue>;
}
