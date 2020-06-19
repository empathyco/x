describe('e2e testing related tags component', () => {
  const query = 'piscina';
  beforeEach(() => {
    cy.visit('/');
    cy.getByDataTest('search-input').as('searchInput');
    cy.searchQuery(query);
    cy.getByDataTest('related-tag').as('relatedTags');
  });

  it('shows related tags when a query is searched', () => {
    cy.get('@relatedTags').should('have.length.gt', 0);
  });

  it('should search more related tags after select one', () => {
    cy.get('@relatedTags')
      .first()
      .click()
      .then(firstRelatedTag => {
        expect(firstRelatedTag.hasClass('x-related-tag--is-selected')).to.eq(true);
      });
    cy.get('@relatedTags').should('have.length.gt', 0);
  });

  it('should search more related tags after deselect one and have none selected', () => {
    cy.get('@relatedTags').first().click();
    cy.get('@relatedTags')
      .first()
      .click()
      .then(firstRelatedTag => {
        expect(firstRelatedTag.hasClass('x-related-tag--is-selected')).to.eq(false);
      });
    cy.get('@relatedTags').should('have.length.gt', 0);
  });

  it("doesn't show related tags after searching a query and clearing it", () => {
    cy.get('@searchInput').clear();
    cy.get('@relatedTags').should('have.length', 0);
  });
});
