describe('e2e testing search-input', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the search input', () => {
    cy.getByDataTest('search-input').should('exist');
  });
});
