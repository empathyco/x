describe('e2e testing query-suggestion component', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.getByDataTest('popular-search').as('popularSearches');
  });

  it('shows popular searches when page loads', () => {
    cy.get('@popularSearches').should('have.length.gt', 0);
  });

  it('updates search input query with the clicked popular search', () => {
    cy.get('@popularSearches')
      .last()
      .as('lastPopularSearch');
    cy.get('@lastPopularSearch').click();

    cy.get('@lastPopularSearch')
      .invoke('text')
      .then(lastPopularSearchQuery => {
        cy.getByDataTest('search-input').should('have.value', lastPopularSearchQuery);
      });
  });
});
