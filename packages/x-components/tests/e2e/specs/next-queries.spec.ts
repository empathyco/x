describe('e2e testing next-queries component', () => {
  const query = 'lego';
  beforeEach(() => {
    cy.visit('/');
    cy.getByDataTest('search-input').as('searchInput');
    cy.searchQuery(query);
    cy.getByDataTest('next-query').as('nextQueries');
  });

  it('shows next queries when a query is searched', () => {
    cy.get('@nextQueries').should('have.length.gt', 0);
  });

  it('updated search input query with the clicked next query', () => {
    cy.get('@nextQueries')
      .last()
      .click()
      .then(lastNextQuery => {
        cy.get('@searchInput').should('have.value', lastNextQuery.text());
      });
  });

  it('shows next queries after searching a query and clearing it', () => {
    cy.get('@searchInput').clear();
    cy.get('@nextQueries').should('have.length.gt', 0);
  });
});
