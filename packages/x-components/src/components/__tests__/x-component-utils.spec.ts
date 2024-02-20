import { mount, Wrapper } from '@vue/test-utils';
import Vue from 'vue';
import { XModuleName } from '../../x-modules/x-modules.types';
import { getXComponentXModuleName, isXComponent, getRootXComponent } from '../x-component.utils';

describe('testing the x-component utils', () => {
  function renderComponent(xModule?: XModuleName): Wrapper<Vue> {
    return mount({
      xModule,
      render(h) {
        return h();
      }
    });
  }

  describe(`testing ${getXComponentXModuleName.name}`, () => {
    it('sets and gets as XComponent name the passed name parameter to the passed component', () => {
      expect(getXComponentXModuleName(renderComponent('searchBox').vm)).toBe('searchBox');
    });

    it('returns null if the passed component is not an XComponent', () => {
      expect(getXComponentXModuleName(renderComponent().vm)).toBeNull();
    });
  });

  describe(`testing ${isXComponent.name}`, () => {
    it('returns true if the passed component is an XComponent', () => {
      expect(isXComponent(renderComponent('searchBox').vm)).toBe(true);
    });

    it('returns false if the passed component is not an XComponent', () => {
      expect(isXComponent(renderComponent().vm)).toBe(false);
    });
  });

  describe(`testing ${getRootXComponent.name}`, () => {
    it('returns the passed component if it is an X Component', () => {
      const renderedXComponent = renderComponent('searchBox').vm;

      expect(isXComponent(renderedXComponent)).toBe(true);
      expect(getRootXComponent(renderedXComponent)).toBe(renderedXComponent);
    });

    it('returns undefined if the passed component does not have X Component ancestors', () => {
      const renderedComponent = renderComponent().vm;
      expect(isXComponent(renderedComponent)).toBe(false);
      expect(getRootXComponent(renderedComponent)).toBeUndefined();
    });

    it('returns the first root x component ancestor of a non x component', () => {
      const nonXComponent = Vue.extend({
        template: '<div>This is the child component</div>'
      });

      const ancestorXComponent = mount({
        xModule: 'searchBox',
        render(h) {
          return h(nonXComponent);
        }
      });

      const nonXComponentVm = ancestorXComponent.findComponent(nonXComponent).vm;

      expect(getRootXComponent(nonXComponentVm)).toBe(ancestorXComponent.vm);
    });
  });
});
