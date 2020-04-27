describe('e2e testing history-queries component', () => {
  const query = 'lego';
  const playmobilQuery = 'playmobil';

  beforeEach(() => {
    cy.visit('/');
    cy.searchQuery(query);
    cy.visit('/');
  });

  it('checks that the local stored history queries load from the start', () => {
    cy.getByDataTest('history-query-suggestion')
      .should('have.length', 1)
      .each(historyQuery => {
        expect(historyQuery.text()).to.eq(query);
      });
  });

  it('searches for a query and checks that it is saved in the history queries', () => {
    cy.getByDataTest('history-query-suggestion')
      .should('have.length', 1)
      .each(historyQuery => {
        expect(historyQuery.text()).to.eq(query);
      });
  });

  it('updates search input query with the clicked history query', () => {
    cy.getByDataTest('history-query-suggestion')
      .last()
      .as('lastHistoryQuery');
    cy.get('@lastHistoryQuery').click();

    cy.getByDataTest('search-input').should('have.value', query);
  });

  it('filter the history queries with the content of the search box', () => {
    cy.searchQuery(playmobilQuery);
    cy.visit('/');

    cy.getByDataTest('history-query-suggestion')
      .as('historyQuerySuggestions')
      .should('have.length', 2);

    const playQuery = 'play';
    cy.typeQuery(playQuery);

    cy.get('@historyQuerySuggestions')
      .should('have.length', 1)
      .each(historyQuery => {
        expect(historyQuery.text()).to.contain(playQuery);
      });
  });

  it('deletes the history query when clicking its remove history query button', () => {
    cy.getByDataTest('history-query-suggestion')
      .as('historyQueries')
      .first()
      .getByDataTest('remove-history-query')
      .click();

    cy.get('@historyQueries').should('not.exist');
  });

  it('deletes all history queries when clicking the remove history queries button', () => {
    cy.searchQuery(playmobilQuery);
    cy.visit('/');

    cy.getByDataTest('clear-history-queries').click();

    cy.getByDataTest('history-query-suggestion').should('not.exist');
  });
});
