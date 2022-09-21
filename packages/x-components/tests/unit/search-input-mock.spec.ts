import { mount } from '@cypress/vue';
import Vue from 'vue';
import { XPlugin } from '../../src/plugins/x-plugin';
import { BaseXBus } from '../../src/plugins/x-bus';
import { e2eAdapter } from '../../src/adapter/e2e-adapter';
import SearchInput from '../../src/x-modules/search-box/components/search-input.vue';
import { searchBoxXModule } from '../../src/x-modules/search-box';

/**
 * Renders an {@link SearchInput} component with the provided options.
 *
 * @returns Helper methods for the rendered {@link SearchInput}.
 */
function mountSearchInput(): MountSearchInputAPI {
  XPlugin.resetInstance();
  mount(
    {
      components: {
        SearchInput
      },
      template: `
        <SearchInput />
      `
    },
    {
      vue: Vue.extend({}),
      plugins: [
        [new XPlugin(new BaseXBus()), { adapter: e2eAdapter, initialXModules: [searchBoxXModule] }]
      ]
    }
  );

  return {
    getSearchInput() {
      return cy.getByDataTest('search-input');
    }
  };
}

describe('testing search input', () => {
  it('ignores invalid typed characters', () => {
    const { getSearchInput } = mountSearchInput();
    getSearchInput().type('le<g>o >star>').invoke('val').should('equal', 'lego star');
  });
});

interface MountSearchInputAPI {
  /** Mounts search input api. */
  getSearchInput: () => Cypress.Chainable<JQuery>;
}
