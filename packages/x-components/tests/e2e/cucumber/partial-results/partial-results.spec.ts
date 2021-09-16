import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { createResultStub } from '../../../../src/__stubs__/results-stubs.factory';

// Background
Given('a results API with partial results', () => {
  cy.intercept('https://api.empathy.co/search', req => {
    req.reply({
      results: [],
      partialResults: [
        {
          query: 'verde azul',
          results: [
            createResultStub('Twister'),
            createResultStub('Juego de Anillas Acuáticas Peces'),
            createResultStub('Jurassic World Dinosaurio de Ataque Varios Modelos')
          ],
          totalResults: 9
        },
        {
          query: 'lego verde',
          results: [
            createResultStub('LEGO Classic Ladrillos Creativos Verdes - 11007'),
            createResultStub('LEGO Creator Grandes Dinosaurios -31058'),
            createResultStub('LEGO My City Casa Familiar - 60291')
          ],
          totalResults: 6
        }
      ]
    });
  }).as('interceptedPartialResults');
});

// Scenario 1
Given('no special config for partial-results view', () => {
  cy.visit('test/partial-results?useMockedAdapter=true');
});

Then('at least {int} related results are displayed', (minResultsWithoutPartials: number) => {
  cy.getByDataTest('regular-result').should('have.length.at.least', minResultsWithoutPartials);
});

And('no partial results are displayed', () => {
  cy.getByDataTest('partial-result-item').should('not.exist');
});

// Scenario 2
Then('less than {int} related results are displayed', (minResultsWithoutPartials: number) => {
  cy.getByDataTest('regular-result').should('have.length.at.most', minResultsWithoutPartials - 1);
});

And('partial results are displayed', () => {
  cy.getByDataTest('partial-result-item').should('exist');
});

// Scenario 3
And('{string} contains the partial query', function (this: { searchedQuery: string }) {
  cy.getByDataTest('partial-query').should(partialQueries => {
    partialQueries.each((_, e) => {
      const wordsInPartialQuery = e.innerText.split(' ');
      for (const word of wordsInPartialQuery) {
        expect(this.searchedQuery).to.contain(word);
      }
    });
  });
});

When('first partial query button is clicked', function (this: { partialQueryButtonText: string }) {
  cy.getByDataTest('partial-query-button')
    .first()
    .click()
    .invoke('text')
    .as('partialQueryButtonText');
});

Then(
  'first partial query is displayed in the search-box',
  function (this: { partialQueryButtonText: string }) {
    cy.getByDataTest('search-input').should('have.value', this.partialQueryButtonText);
  }
);
