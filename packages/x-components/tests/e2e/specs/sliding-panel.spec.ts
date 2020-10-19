describe('e2e testing sliding panel component', () => {
  const query = 'lego';
  beforeEach(() => {
    cy.visit('/');
    cy.searchQuery(query);
    cy.getByDataTest('sliding-panel-scroll').as('slidingPanelScroll');
  });

  it('scrolls the sliding panel back to 0 when content inside sliding panel changes', () => {
    cy.get('@slidingPanelScroll').should('have.prop', 'scrollLeft').and('eq', 0);
    cy.get('@slidingPanelScroll').scrollTo('right', { easing: 'linear' });
    cy.get('@slidingPanelScroll').should('have.prop', 'scrollLeft').and('not.eq', 0);
    cy.clearSearchInput();
    cy.searchQuery('playmobil');
    cy.get('@slidingPanelScroll').should('have.prop', 'scrollLeft').and('eq', 0);
  });

  it("hides the buttons if they're not needed when content inside sliding panel changes", () => {
    cy.getByDataTest('sliding-panel-right-button').as('rightButton').should('be.visible');
    cy.clearSearchInput();
    cy.searchQuery('nenuco');
    cy.get('@rightButton').should('not.be.visible');
  });

  // eslint-disable-next-line max-len
  it('hides the navigation buttons correctly after selecting an element inside the sliding panel changes its content', () => {
    cy.getByDataTest('sliding-panel-right-button').as('rightButton').should('be.visible');
    cy.getByDataTest('related-tag').last().click();
    cy.get('@rightButton').should('not.be.visible');
  });
});
