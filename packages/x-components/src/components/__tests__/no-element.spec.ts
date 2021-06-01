import { mount } from '@vue/test-utils';
import { getDataTestSelector } from '../../__tests__/utils';
import { NoElement } from '../no-element';

describe('testing no component', () => {
  it('renders the first node passed in the default slot and bind the css classes', () => {
    const wrapper = mount({
      template: `
          <NoElement class="test">
            <div data-test="node">test</div>
          </NoElement>`,
      components: {
        NoElement
      }
    });
    expect(wrapper.find(getDataTestSelector('node')).element).toBeDefined();
    expect(wrapper.find(getDataTestSelector('node')).classes()).toEqual(['test']);
  });
});
