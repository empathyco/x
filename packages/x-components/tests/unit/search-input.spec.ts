import SearchInput from '../../src/x-modules/search-box/components/search-input.vue';

function render() {
  cy.mount(SearchInput);

  return {
    getSearchInput: () => cy.getByDataTest('search-input')
  };
}

describe('testing search input', () => {
  it('ignores invalid typed characters', () => {
    const { getSearchInput } = render();

    getSearchInput().type('le<g>o >star>').invoke('val').should('equal', 'lego star');
  });
});
