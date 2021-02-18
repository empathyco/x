describe('slots test', () => {
  beforeEach(() => {
    cy.goToView('slotsComponents');
  });

  it('renders fully working react class components as slots', () => {
    cy.getByDataTest('react-class-counter-label').should(
      'have.text',
      'Times I want to shoot myself:'
    );
    cy.getByDataTest('react-class-counter-count').should('have.text', 0);
    cy.getByDataTest('react-class-counter-increment').click();
    cy.getByDataTest('react-class-counter-count').should('have.text', 1);
  });

  it('renders fully working react function components as slots', () => {
    cy.getByDataTest('react-functional-counter-label').should(
      'have.text',
      'Times I want to shoot myself:'
    );
    cy.getByDataTest('react-functional-counter-count').should('have.text', 0);
    cy.getByDataTest('react-functional-counter-increment').click();
    cy.getByDataTest('react-functional-counter-count').should('have.text', 1);
  });
});
