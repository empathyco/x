import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { XModuleName } from '../../x-modules/x-modules.types';
import { getXComponentXModuleName, isXComponent } from '../x-component.utils';

describe('testing the x-component utils', () => {
  function renderComponent(xModule?: XModuleName): Wrapper<Vue> {
    return mount({
      xModule,
      render(h) {
        return h();
      }
    });
  }
  it('sets and gets as XComponent name the passed name parameter to the passed component', () => {
    expect(getXComponentXModuleName(renderComponent('searchBox').vm)).toBe('searchBox');
  });

  it('returns null if the passed component is not an XComponent', () => {
    expect(getXComponentXModuleName(renderComponent().vm)).toBeNull();
  });

  it('returns true if the passed component is an XComponent', () => {
    expect(isXComponent(renderComponent('searchBox').vm)).toBe(true);
  });

  it('returns false if the passed component is not an XComponent', () => {
    expect(isXComponent(renderComponent().vm)).toBe(false);
  });
});
