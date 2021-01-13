describe('custom commands tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('cy.getByDataTest gets the DOM element looking for its data-test attribute', () => {
    cy.getByDataTest('search-input').should('exist');
  });

  it(
    'cy.searchQuery searches the desired query typing it in the search input and pressing ' +
      'enter key',
    () => {
      const query = 'lego';

      cy.searchQuery(query);
      cy.getByDataTest('search-input')
        .as('searchInput')
        .invoke('val')
        .then(inputText => {
          expect(inputText).to.equal(query);
        });
      cy.get('@searchInput').should('not.be.focused');
    }
  );

  it('cy.typeQuery types the desired query into the search input', () => {
    const query = 'lego';

    cy.typeQuery(query);
    cy.getByDataTest('search-input')
      .as('searchInput')
      .invoke('val')
      .then(inputText => {
        expect(inputText).to.equal(query);
      });
    cy.get('@searchInput').should('be.focused');
  });
});
