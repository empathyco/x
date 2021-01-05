describe('slots test', () => {
  let consoleSpy: Cypress.Agent<sinon.SinonSpy>;
  Cypress.on('window:before:load', pageWindow => {
    consoleSpy = cy.spy(pageWindow.console, 'error');
  });

  beforeEach(() => {
    cy.goToView('slots');
    cy.getByDataTest('toggle-show').as('toggleShow');
    cy.getByDataTest('toggle-container').as('toggleContainer');
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(consoleSpy).not.to.be.called;
  });

  it('waits for the animation to finish before removing the slot content', () => {
    cy.get('@toggleShow').click();
    cy.getByDataTest('react-content').should('be.visible');

    cy.get('@toggleShow').click();
    cy.getByDataTest('react-content').should('be.visible');
    cy.getByDataTest('react-content').should('not.be.visible');
  });

  it('does not crash if the parent element is removed', () => {
    cy.get('@toggleShow').click();
    cy.getByDataTest('react-content').should('be.visible');

    cy.get('@toggleContainer').click();
    cy.getByDataTest('react-content').should('not.be.visible');
  });

  it('allows to update a vue component from a react children using scoped slots', () => {
    cy.getByDataTest('react-input').type('Hello world').should('have.value', 'Hello world');
  });

  it('renders text in the slot', () => {
    cy.getByDataTest('text-slot-content').should('have.text', 'text content');
  });

  it('renders default content if nothing is passed to slot', () => {
    cy.getByDataTest('no-slot-content').should('have.text', 'default slot content');
  });
});
