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

  it('renders text in the slot', () => {
    cy.getByDataTest('text-slot-content').should('have.text', 'text content');
  });

  it('renders default content if nothing is passed to slot', () => {
    cy.getByDataTest('no-slot-content').should('have.text', 'default slot content');
  });
});
