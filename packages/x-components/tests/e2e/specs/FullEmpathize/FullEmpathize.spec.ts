describe('Testing FullEmpathize', () => {
  beforeEach(() => {
    cy.visit('/full-empathize');
    cy.getByDataTest('search-input').as('searchInput');
  });

  describe('Query Suggestions', () => {
    it('shows query suggestions when a query is searched', () => {
      cy.typeQuery('lego');
      cy.getByDataTest('query-suggestions').should('have.length.gt', 0);
    });

    it('updates the search input when selecting a query suggestion', () => {
      cy.typeQuery('lego');
      cy.getByDataTest('query-suggestion')
        .last()
        .click()
        .then(lastQuerySuggestion => {
          cy.get('@searchInput').should('have.value', lastQuerySuggestion.text());
        });
    });

    it('do not show query suggestions when a query is searched and cleaned', () => {
      cy.searchQuery('lego');
      cy.clearSearchInput();
      cy.focusSearchInput();
      cy.getByDataTest('query-suggestions').should('not.exist');
    });
  });

  describe('History Queries', () => {
    it('shows history queries when some queries are searched and cleaned', () => {
      cy.getByDataTest('search-input').as('searchInput');
      cy.searchQueries('lego', 'playmobil');
      cy.clearSearchInput();
      cy.focusSearchInput();
      cy.getByDataTest('history-query-item').should('have.length', 2);
    });

    it('updates search input when selecting a history query', () => {
      cy.searchQueries('lego', 'piscina', 'playmovil');
      cy.clearSearchInput();
      cy.focusSearchInput();
      cy.getByDataTest('history-query')
        .last()
        .click()
        .then(lastHistoryQuery => {
          cy.get('@searchInput').should('have.value', lastHistoryQuery.text());
        });
    });

    it('deletes a history query', () => {
      cy.searchQueries('lego', 'piscina', 'playmovil');
      cy.clearSearchInput();
      cy.focusSearchInput();
      cy.getByDataTest('history-query')
        .last()
        .then(lastHistoryQuery => {
          cy.getByDataTest('remove-history-query').last().click();
          cy.getByDataTest('history-query').should('not.contain', lastHistoryQuery.text());
        });
    });
  });

  describe('Popular Searches', () => {
    it('updates search input when selecting a popular search', () => {
      cy.focusSearchInput();
      cy.getByDataTest('popular-search')
        .last()
        .click()
        .then(lastPopularSearch => {
          cy.get('@searchInput').should('have.value', lastPopularSearch.text());
        });
    });
  });

  describe('Next Queries', () => {
    it('shows next queries when a query is searched', () => {
      cy.typeQuery('lego');
      cy.getByDataTest('next-query').should('have.length.gt', 0);
    });

    it('updates the search input value when clicking a next query', () => {
      cy.typeQuery('lego');
      cy.getByDataTest('next-query')
        .last()
        .click()
        .then(lastNextQuery => {
          cy.get('@searchInput').should('have.value', lastNextQuery.text());
        });
    });
  });

  describe('RelatedTags', () => {
    it('shows related tags when a query is searched', () => {
      cy.typeQuery('lego');
      cy.focusSearchInput();
      cy.getByDataTest('related-tag').should('have.length.gt', 0);
    });

    it('allows selecting a related tag', () => {
      cy.typeQuery('lego');
      cy.focusSearchInput();
      cy.getByDataTest('related-tag')
        .last()
        .click()
        .then(lastRelatedTag => {
          expect(lastRelatedTag.hasClass('x-related-tag--is-selected')).to.eq(true);
        });
    });
  });

  describe('Recommendations', () => {
    it('shows recommendations', () => {
      cy.focusSearchInput();
      cy.getByDataTest('recommendation-item').as('recommendationItem');
      cy.get('@recommendationItem').should('have.length.gt', 0);
    });
  });

  describe('Identifier Results', () => {
    it('shows identifier results when a query identifier is searched', () => {
      cy.searchQuery('a03');
      cy.focusSearchInput();
      cy.getByDataTest('identifier-results-item').should('have.length.gt', 0);
    });

    it('clears the identifier results when the query is cleared', () => {
      cy.typeQuery('a03');
      cy.getByDataTest('identifier-result').should('have.length.gt', 0);
      cy.clearSearchInput();
      cy.getByDataTest('identifier-result').should('not.exist');
    });

    it('redirects to the product page when the identifier result is clicked', () => {
      cy.searchQuery('a03');
      cy.focusSearchInput();
      cy.getByDataTest('result-link')
        .last()
        .click()
        .then(() => {
          cy.url().should('include', 'product_page');
        });
    });
  });
});
