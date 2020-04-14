describe('e2e testing query-suggestion component', () => {
  const query = 'lego';

  beforeEach(() => {
    cy.visit('/');
    cy.getByDataTest('search-input').as('searchInput');
    cy.typeQuery(query);
    cy.getByDataTest('query-suggestion').as('querySuggestions');
  });

  it('shows query suggestions when a query is written', function() {
    cy.get('@querySuggestions')
      .should('have.length.gt', 0)
      .each(querySuggestion => {
        expect(querySuggestion.text()).to.include(query);
      });
  });

  it('updates search input query with the clicked query suggestion', function() {
    cy.get('@querySuggestions')
      .last()
      .as('lastQuerySuggestion');

    cy.get('@lastQuerySuggestion').click();

    cy.get('@lastQuerySuggestion')
      .invoke('text')
      .then(lastQuerySuggestionQuery => {
        cy.get('@searchInput').should('have.value', lastQuerySuggestionQuery);
      });
  });
});
