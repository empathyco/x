import { mount } from '@vue/test-utils';
import Vue, { CreateElement } from 'vue';

import {
  getXComponentXModuleName,
  isXComponent,
  setXComponentXModuleName
} from '../x-component.utils';

describe('testing the x-component utils', () => {
  const testComponent = {
    render(h: CreateElement) {
      return h();
    }
  };
  let testXComponentWrapper: Vue;

  beforeEach(() => {
    testXComponentWrapper = (mount(testComponent) as unknown) as Vue;
  });

  it('sets and gets as XComponent name the passed name parameter to the passed component', () => {
    setXComponentXModuleName(testXComponentWrapper, 'searchBox');
    expect(getXComponentXModuleName(testXComponentWrapper)).toBe('searchBox');
  });

  it('returns null if the passed component is not an XComponent', () => {
    expect(getXComponentXModuleName(testXComponentWrapper)).toBeNull();
  });

  it('returns true if the passed component is an XComponent', () => {
    setXComponentXModuleName(testXComponentWrapper, 'searchBox');
    expect(isXComponent(testXComponentWrapper)).toBe(true);
  });

  it('returns false if the passed component is not an XComponent', () => {
    expect(isXComponent(testXComponentWrapper)).toBe(false);
  });
});
