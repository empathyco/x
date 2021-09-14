import { PageableRequest } from '@empathyco/x-adapter';
import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import {
  getNextQueriesStub,
  getRelatedTagsStub,
  getResultsStub,
  getSuggestionsStub
} from '../../../src/__stubs__';

let resultsList: string[] = [];

// ID Results
Then('identifier results are displayed', () => {
  cy.getByDataTest('identifier-results-item').should('have.length.at.least', 1);
});

Then('no identifier results are displayed', () => {
  cy.getByDataTest('identifier-result-item').should('not.exist');
});

// History Queries
When('clear history queries button is clicked', () => {
  cy.getByDataTest('clear-history-queries').click();
});

Then(
  'the searched query is displayed in history queries',
  function (this: { searchedQuery: string }) {
    cy.getByDataTest('history-query')
      .should('have.length.at.least', 1)
      .each(historyQuery => expect(historyQuery).to.contain(this.searchedQuery))
      .invoke('text')
      .as('historicalQuery');
  }
);

// Next Queries
Then('next queries are displayed', () => {
  cy.getByDataTest('next-query').should('have.length.at.least', 1).invoke('text').as('nextQueries');
});

// Query Suggestions
Then('query suggestions are displayed', () => {
  cy.getByDataTest('query-suggestion').should('have.length.at.least', 1);
});

Then('related tags are displayed', () => {
  cy.getByDataTest('related-tag').should('have.length.at.least', 1);
});

// Results
Then('related results are displayed', () => {
  resultsList = [];
  cy.getByDataTest('result-item')
    .should('have.length.at.least', 1)
    .each($result => {
      resultsList.push($result.text());
    });
});

Then('related results have changed', () => {
  cy.getByDataTest('result-item').should($results => {
    const compoundResultsList = $results.toArray().map(resultElement => resultElement.textContent);
    expect(compoundResultsList.every(item => resultsList.includes(item!))).to.eq(false);
  });
});

// Search Box
When('a {string} with results is typed', (query: string) => {
  cy.typeQuery(query).then(() => {
    cy.getByDataTest('search-input').invoke('val').as('searchedQuery');
  });
});

When('{string} is searched', (query: string) => {
  cy.searchQuery(query).then(() => {
    cy.getByDataTest('search-input').invoke('val').as('searchedQuery');
  });
});

When('clear search button is pressed', () => {
  cy.clearSearchInput();
});

Then(
  'the searched query is displayed in the search-box',
  function (this: { searchedQuery: string }) {
    cy.getByDataTest('search-input').should('have.value', this.searchedQuery);
  }
);

Then(
  'number of rows requested in {string} is {int}',
  (request: string, maxItemsToRequest: number) => {
    cy.wait(`@${request}`).then(({ request }) => {
      const { rows } = JSON.parse(request.body) as PageableRequest;
      expect(rows).to.equal(maxItemsToRequest);
    });
  }
);

Given('a next queries API', () => {
  cy.intercept('https://api.empathy.co/getNextQueries', req => {
    req.reply({
      nextQueries: getNextQueriesStub()
    });
  });
});

Given('a suggestions API', () => {
  cy.intercept('https://api.empathy.co/getSuggestions', req => {
    req.reply({
      suggestions: getSuggestionsStub('Suggestion')
    });
  });
});

Given('a related tags API', () => {
  cy.intercept('https://api.empathy.co/getRelatedTags', req => {
    req.reply({
      relatedTags: getRelatedTagsStub()
    });
  });
});

Given('a results API', () => {
  cy.intercept('https://api.empathy.co/search', req => {
    req.reply({
      results: getResultsStub()
    });
  });
});

Given('an ID results API', () => {
  cy.intercept('https://api.empathy.co/searchById', req => {
    req.reply({
      results: getResultsStub()
    });
  });
});
