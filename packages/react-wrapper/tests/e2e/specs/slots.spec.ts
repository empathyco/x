describe('slots test', () => {
  beforeEach(() => {
    cy.goToView('slots');
    cy.getByDataTest('toggle-show').as('toggleShow');
  });

  it('waits for the animation to finish before removing the slot content', () => {
    cy.get('@toggleShow').click();
    cy.getByDataTest('react-content').should('be.visible');

    cy.get('@toggleShow').click();
    cy.getByDataTest('react-content').should('be.visible');
    cy.getByDataTest('react-content').should('not.be.visible');
  });
});
