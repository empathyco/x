describe('Testing FullNoEmpathize', () => {
  const query = 'playmobil';

  beforeEach(() => {
    cy.visit('/full-no-empathize');
    cy.getByDataTest('search-input').as('searchInput');
  });

  describe('Next Queries', () => {
    // eslint-disable-next-line max-len
    it('shows next queries when a query is searched, cleaned and reload page if load onInit is true in configuration', () => {
      cy.searchQuery(query);
      cy.clearSearchInput();
      cy.reload();
      cy.getByDataTest('next-query').should('have.length.gt', 0);
    });
  });
});
