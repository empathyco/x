describe.skip('e2e testing no-suggestions component', () => {
  const queryWithSuggestions = 'playmobil';
  const queryWithoutSuggestions = 'gfbhjds';

  beforeEach(() => {
    cy.visit('/');
  });

  it(`doesn't display the no-suggestions component when there are query suggestions to\
   show`, () => {
    cy.getByDataTest('no-suggestions').should('not.exist');
    cy.typeQuery(queryWithSuggestions);
    cy.getByDataTest('query-suggestion'); // wait for the query suggestions
    cy.getByDataTest('no-suggestions').should('not.exist');
  });

  it('displays the no-suggestions component when there are not query suggestions to show', () => {
    cy.typeQuery(queryWithoutSuggestions);
    cy.getByDataTest('no-suggestions').should('exist');
  });

  it(`doesn't display the no-suggestions component when the input has been cleared and\
   it displays when a suggestion without query suggestions is selected`, () => {
    cy.searchQuery(queryWithoutSuggestions);
    cy.getByDataTest('no-suggestions').should('exist');
    cy.getByDataTest('clear-search-input').click();
    cy.getByDataTest('no-suggestions').should('not.exist');
    cy.getByDataTest('history-query').last().click();
    cy.getByDataTest('no-suggestions').should('exist');
  });
});
