describe('e2e testing base-events-modal component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('opens when clicking the open button component', () => {
    cy.getByDataTest('modal').should('not.exist');
    cy.getByDataTest('open-modal').click();
    cy.getByDataTest('modal').should('exist');
  });

  describe('testing closing modal', () => {
    beforeEach(() => {
      cy.getByDataTest('open-modal').click();
    });

    it('does not close the modal when clicking inside its rendered content**', () => {
      cy.getByDataTest('modal').children().first().click().should('exist');
    });

    it('closes when clicking outside its slot content or the close button component', () => {
      cy.log('**closes the modal when clicking outside its slot rendered content**');
      cy.getByDataTest('modal').should('exist');
      cy.get('body').click('topRight');
      cy.getByDataTest('modal').should('not.exist');

      cy.log('**closes the modal when clicking close-modal component**');
      cy.getByDataTest('open-modal').click();
      cy.getByDataTest('close-modal').click();
      cy.getByDataTest('modal').should('not.exist');
    });
  });
});
