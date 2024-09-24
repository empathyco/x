import { mount } from 'cypress/vue2';
import { XPlugin } from '../../src/plugins/x-plugin';
import { e2eAdapter } from '../../src/adapter/e2e-adapter';
import SearchInput from '../../src/x-modules/search-box/components/search-input.vue';
import { searchBoxXModule } from '../../src/x-modules/search-box';
import { XDummyBus } from '../../src/__tests__/bus.dummy';

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
      plugins: [
        [new XPlugin(new XDummyBus()), { adapter: e2eAdapter, initialXModules: [searchBoxXModule] }]
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
