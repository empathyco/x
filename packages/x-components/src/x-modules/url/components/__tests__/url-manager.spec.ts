import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { isXComponent } from '../../../../components';
import { UrlManager } from '../index';

describe('testing URLManager component', () => {
  function renderURLManager(): URLManagerAPI {
    const wrapper = mount(UrlManager);

    return {
      wrapper
    };
  }

  it('is an x-component', () => {
    const { wrapper } = renderURLManager();
    expect(isXComponent(wrapper.vm)).toEqual(true);
  });
});

interface URLManagerAPI {
  /** Test wrapper of the {@link URLManager} instance. */
  wrapper: Wrapper<Vue>;
}
