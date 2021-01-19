import { And, Before, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

let nextQueriesResults = 0;
let resultsCount = 0;
let resultsList: string[] = [];
const compoundResultsList: string[] = [];
let startQuery = 0;
let startSecondQuery = 0;
let interval = 0;

Before({ tags: '@noURLparameter' }, () => {
  cy.visit('/test/search-box', {
    qs: {
      xModules: JSON.stringify({
        historyQueries: {
          config: {
            hideIfEqualsQuery: true
          }
        }
      })
    }
  });
});
// Scenario 1
Given(
  'History queries displays the query right after a search is not {boolean}',
  (hideIfEqualsQuery: boolean) => {
    cy.visit('/test/search-box', {
      qs: {
        xModules: JSON.stringify({
          historyQueries: {
            config: {
              hideIfEqualsQuery
            }
          }
        })
      }
    });
  }
);
And(
  'the time after a search is triggered is {int} ms if {boolean} is true',
  (instantDebounceInMs: any, instant: boolean) => {
    if (!instant) {
      cy.getByDataTest('search-input-instant').uncheck();
    } else {
      cy.getByDataTest('search-input-instant').check();
    }
    cy.getByDataTest('search-input-debounce').clear().type(instantDebounceInMs);
  }
);
And('no queries have been searched', () => {
  cy.getByDataTest('search-input').should('exist');
  cy.getByDataTest('search-input').should('have.value', '');
  cy.getByDataTest('results-list').should('not.exist');
  cy.getByDataTest('query-suggestions').should('not.exist');
  cy.getByDataTest('next-queries').should('not.exist');
  cy.getByDataTest('related-tags').should('not.exist');
  cy.getByDataTest('history-query').should('not.exist');
});
When('a {string} with results is typed - timestamp needed', (query: string) => {
  cy.typeQuery(query).then(() => {
    startQuery = Date.now();
  });
  cy.intercept({
    pathname: Cypress.env('searchRequestURL'),
    query: {
      q: query
    }
  }).as('waitForQueryResponseSB');
});
And('{string} is clicked immediately after', (buttonOrKey: string) => {
  if (buttonOrKey === 'enterKey') {
    cy.getByDataTest('search-input').type('{enter}');
  } else if (buttonOrKey === 'searchButton') {
    cy.getByDataTest('search-button').click();
  }
});
And(
  '{string} is displayed in history queries is not {boolean}',
  (query: string, hideIfEqualsQuery: boolean) => {
    if (!hideIfEqualsQuery) {
      cy.getByDataTest('history-query')
        .should('have.length', 1)
        .each(historyQuery => {
          expect(historyQuery.text()).to.include(query);
        });
    } else {
      cy.getByDataTest('history-queries').should('not.exist');
    }
  }
);

// Scenario 2
And('a {string} has been searched', (query: string) => {
  cy.intercept({
    pathname: Cypress.env('nextQueriesRequestURL'),
    query: {
      q: query
    }
  }).as('waitForNextQueriesResponseSB');
  cy.intercept({
    pathname: Cypress.env('relatedTagsRequestURL'),
    query: {
      q: query
    }
  }).as('waitForRelatedTagsResponseSB');
  cy.searchQuery(query).then(() => {
    cy.wait('@waitForNextQueriesResponseSB');
  });
});
And('the number of next query results are stored', () => {
  if (cy.$$('[data-test = "next-queries"]').length > 0) {
    cy.getByDataTest('next-query').then($elements => {
      nextQueriesResults = $elements.length;
    });
  } else {
    nextQueriesResults = 0;
  }
});
And('History queries are being displayed is not {boolean}', (hideIfEqualsQuery: boolean) => {
  if (hideIfEqualsQuery) {
    cy.getByDataTest('history-queries').should('not.exist');
  }
});
When('the {string} is cleared by {string}', (query: string, cleared: string) => {
  if (cleared === 'clickButton') {
    cy.clearSearchInput();
  } else if (cleared === 'manually') {
    cy.getByDataTest('search-input').type('{backspace}'.repeat(query.length));
  }
});
Then('the search box is empty', () => {
  cy.getByDataTest('search-input').should('have.value', '');
});
And('related results are cleared', () => {
  cy.getByDataTest('result-item').should('not.exist');
});
And('query suggestions are cleared', () => {
  cy.getByDataTest('query-suggestions').should('not.exist');
});
And('next queries are not cleared', () => {
  if (nextQueriesResults === 0) {
    cy.getByDataTest('next-query').should('not.exist');
  } else {
    cy.getByDataTest('next-query').should('have.length.gt', 0);
  }
});
And('related tags are cleared', () => {
  cy.getByDataTest('related-tag').should('not.exist');
});
And('{string} is displayed in history queries', (query: string) => {
  cy.getByDataTest('history-query').should('have.length', 1).and('contain.text', query);
});

// Scenario 3
Then('no related results are displayed before {int}', (instantDebounceInMs: number) => {
  cy.getByDataTest('result-item')
    .should('not.exist')
    .then(() => {
      expect(Date.now()).to.be.lessThan(startQuery + instantDebounceInMs);
      resultsCount = 0;
    });
});
And(
  'related results are displayed after {int} is {boolean}',
  (instantDebounceInMs: number, instant: boolean) => {
    cy.intercept('@waitForQueryResponseSB').then(() => {
      if (instant) {
        cy.getByDataTest('result-item')
          .should('have.length.gt', resultsCount)
          .each($result => {
            resultsList.push($result.text());
          })
          .then(() => {
            interval = Date.now() - startQuery;
            expect(interval).to.be.greaterThan(instantDebounceInMs);
          });
        resultsCount = resultsList.length;
        resultsList = [];
      } else {
        cy.getByDataTest('result-item').should('not.exist');
      }
    });
  }
);
And('next queries are displayed after instantDebounceInMs is {boolean}', (instant: boolean) => {
  if (instant) {
    cy.getByDataTest('next-query').should('have.length.gt', 0);
  } else {
    cy.getByDataTest('next-query').should('not.exist');
  }
});
And('related tags are displayed after instantDebounceInMs is {boolean}', (instant: boolean) => {
  if (instant) {
    cy.getByDataTest('related-tag').should('have.length.gt', 0);
  } else {
    cy.getByDataTest('related-tag').should('not.exist');
  }
});

// Scenario 4
When('{string} is added to the search', (secondQuery: string) => {
  cy.typeQuery(` ${secondQuery}`).then(() => {
    startSecondQuery = Date.now();
  });
});
Then('new related results are not displayed before {int}', (instantDebounceInMs: number) => {
  cy.getByDataTest('result-item')
    .should($results => {
      expect($results).to.have.length(resultsCount);
    })
    .then(() => {
      expect(Date.now()).to.be.lessThan(startSecondQuery + instantDebounceInMs);
    });
});
And(
  'new related results are displayed after {int} is {boolean}',
  (instantDebounceInMs: number, instant: boolean) => {
    if (instant) {
      cy.getByDataTest('result-item')
        .should('have.length.lt', resultsCount)
        .each($result => {
          compoundResultsList.push($result.text());
        })
        .then(() => {
          interval = Date.now() - startSecondQuery;
          expect(interval).to.be.greaterThan(instantDebounceInMs);
          resultsCount = resultsList.length;
        });
    } else {
      cy.getByDataTest('result-item').should('not.exist');
    }
  }
);
And('new related results are different from previous ones', () => {
  expect(compoundResultsList.every(item => resultsList.includes(item))).to.eq(false);
});
When('{string} is deleted from the search', (secondQuery: string) => {
  cy.getByDataTest('search-input')
    .type('{backspace}'.repeat(secondQuery.length))
    .then(() => {
      startQuery = Date.now();
    });
});
Then('old related results are not displayed before {int}', (instantDebounceInMs: number) => {
  cy.getByDataTest('result-item')
    .should('have.length', compoundResultsList.length)
    .then(() => {
      expect(Date.now()).to.be.lessThan(startQuery + instantDebounceInMs);
    });
  resultsCount = compoundResultsList.length;
});
