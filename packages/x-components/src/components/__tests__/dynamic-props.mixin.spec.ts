import Vue from 'vue';
import { mount, Wrapper } from '@vue/test-utils';
import { ExtractArrayItems } from '@empathyco/x-utils';
import { dynamicPropsMixin } from '../dynamic-props.mixin';

const renderComponent = ({
  props = ['list', 'button'] as const
}: ComponentOptions = {}): ComponentAPI => {
  const wrapper = mount({
    mixins: [dynamicPropsMixin<ExtractArrayItems<typeof props>>(props)],
    render: h => h(),
    props: ['data']
  });
  return { wrapper };
};

describe('dynamicPropsMixin', () => {
  it('expects to have the defined props from the mixin', () => {
    const { wrapper } = renderComponent();
    const props = Object.keys(wrapper.props());
    expect(props).toHaveLength(3);
    expect(props.includes('list')).toBeTruthy();
    expect(props.includes('button')).toBeTruthy();
    expect(props.includes('data')).toBeTruthy();
  });
});

/**
 * The options for the `renderComponent` function.
 */
interface ComponentOptions {
  props?: readonly string[];
}

/**
 * Test API for the component.
 */
interface ComponentAPI {
  /** The wrapper for the component. */
  wrapper: Wrapper<Vue>;
}
