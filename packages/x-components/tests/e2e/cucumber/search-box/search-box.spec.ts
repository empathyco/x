import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { createResultStub } from '../../../../src/__stubs__';
import { InstallXOptions } from '../../../../src/x-installer/x-installer/types';

let resultsCount = 0;
let resultsList: string[] = [];
const compoundResultsList: string[] = [];
let startQuery = 0;
let startSecondQuery = 0;
let interval = 0;

// Background
Given('a results API with a known response', () => {
  cy.intercept('https://api.empathy.co/search', req => {
    req.reply({
      results: [
        createResultStub('LEGO Super Mario Pack Inicial: Aventuras con Mario - 71360', {
          images: ['https://picsum.photos/seed/1/100/100']
        }),
        createResultStub('LEGO Duplo Classic Caja de Ladrillos - 1091', {
          images: ['https://picsum.photos/seed/1/100/200']
        }),
        createResultStub('LEGO City Coche Patrulla de Policía - 60239', {
          images: ['https://picsum.photos/seed/1/100/300']
        }),
        createResultStub('LEGO City Police Caja de Ladrillos - 60270', {
          images: ['https://picsum.photos/seed/1/100/400']
        }),
        createResultStub('LEGO Friends Parque para Cachorros - 41396', {
          images: ['https://picsum.photos/seed/1/100/500']
        }),
        createResultStub('LEGO Creator Ciberdrón - 31111', {
          images: ['https://picsum.photos/seed/1/100/600']
        }),
        createResultStub('LEGO Technic Dragster - 42103', {
          images: ['https://picsum.photos/seed/1/100/700']
        }),
        createResultStub('LEGO Technic Dragster - 42103', {
          images: ['https://picsum.photos/seed/1/100/800']
        })
      ]
    });
  }).as('interceptedResults');
});

Given(
  'following config: hide if equals query {boolean}, instant search {boolean}, debounce {int}',
  (hideIfEqualsQuery: boolean, instant: boolean, instantDebounceInMs: number) => {
    const config: InstallXOptions['xModules'] = {
      historyQueries: {
        config: {
          hideIfEqualsQuery
        }
      }
    };
    cy.visit('/layout?useMockedAdapter=true', {
      qs: {
        xModules: JSON.stringify(config)
      }
    }).then(() => {
      cy.getByDataTest('search-input-debounce').clear().type(instantDebounceInMs.toString());
      if (!instant) {
        cy.getByDataTest('search-input-instant').uncheck();
      } else {
        cy.getByDataTest('search-input-instant').check();
      }
    });
  }
);

// Scenario 1
And('no queries have been searched', () => {
  cy.getByDataTest('search-input').should('exist');
  cy.getByDataTest('search-input').should('have.value', '');
  cy.getByDataTest('results-list').should('not.exist');
  cy.getByDataTest('query-suggestions').should('not.exist');
  cy.getByDataTest('next-queries').should('not.exist');
  cy.getByDataTest('related-tags').should('not.exist');
  cy.getByDataTest('history-query').should('not.exist');
});

When('{string} is clicked immediately after', (buttonOrKey: string) => {
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
  cy.getByDataTest('next-query').should('have.length.at.least', 1);
});

And('related tags are cleared', () => {
  cy.getByDataTest('related-tag').should('not.exist');
});

// Scenario 3
When('a {string} with results is typed - timestamp needed', (query: string) => {
  cy.typeQuery(query).then(() => {
    startQuery = Date.now();
  });
});

Then('no related results are displayed before {int}', (instantDebounceInMs: number) => {
  cy.getByDataTest('result-item')
    .should('not.exist')
    .then(() => {
      interval = startQuery + instantDebounceInMs - Date.now();
      expect(instantDebounceInMs).to.be.greaterThan(interval);
      resultsCount = 0;
    });
});
And(
  'related results are displayed after {int} is {boolean}',
  (instantDebounceInMs: number, instant: boolean) => {
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
  }
);
And('next queries are displayed after instantDebounceInMs is {boolean}', (instant: boolean) => {
  if (instant) {
    cy.getByDataTest('next-query').should('have.length.at.least', 1);
  } else {
    cy.getByDataTest('next-query').should('not.exist');
  }
});
And('related tags are displayed after instantDebounceInMs is {boolean}', (instant: boolean) => {
  if (instant) {
    cy.getByDataTest('related-tag').should('have.length.at.least', 1);
  } else {
    cy.getByDataTest('related-tag').should('not.exist');
  }
});

// Scenario 4
Given('a second results API with a known response', () => {
  cy.intercept('https://api.empathy.co/search', req => {
    req.reply({
      results: [
        createResultStub('LEGO Duplo Disney Tren de Cumpleaños de Mickey y Minnie - 10941'),
        createResultStub('LEGO Disney Granja de Mickey Mouse y el Pato Donald - 10775')
      ]
    });
  }).as('interceptedSecondResults');
});

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
      interval = startSecondQuery + instantDebounceInMs - Date.now();
      expect(instantDebounceInMs).to.be.greaterThan(interval);
    });
});

And(
  'new related results are displayed after {int} is {boolean}',
  (instantDebounceInMs: number, instant: boolean) => {
    if (instant) {
      cy.getByDataTest('result-item')
        .should('have.length.at.most', resultsCount - 1)
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
      interval = startQuery + instantDebounceInMs - Date.now();
      expect(instantDebounceInMs).to.be.greaterThan(interval);
    });
  resultsCount = compoundResultsList.length;
});
