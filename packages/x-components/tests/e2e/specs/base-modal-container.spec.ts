describe('e2e testing base-modal-container component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('opens when clicking the open button component', () => {
    cy.getByDataTest('modal-container').should('not.exist');
    cy.getByDataTest('open-button').click();
    cy.getByDataTest('modal-container').should('exist');
  });

  describe('testing closing modal', () => {
    beforeEach(() => {
      cy.getByDataTest('open-button').click();
    });

    it('does not close the modal when clicking inside its rendered content**', () => {
      cy.getByDataTest('modal-container').children().first().click().should('exist');
    });

    it('closes when clicking outside its slot content or the close button component', () => {
      cy.log('**closes the modal when clicking outside its slot rendered content**');
      cy.getByDataTest('modal-container').should('exist');
      cy.get('body').click('topLeft');
      cy.getByDataTest('modal-container').should('not.exist');

      cy.log('**closes the modal when clicking close-button component**');
      cy.getByDataTest('open-button').click();
      cy.getByDataTest('close-button').click();
      cy.getByDataTest('modal-container').should('not.exist');
    });
  });
});
