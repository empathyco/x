// https://docs.cypress.io/api/introduction/api.html

describe('my First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/');
    cy.get('[data-cy=search-input]').should('exist');
    expect(true).to.be.true;
  });
});
