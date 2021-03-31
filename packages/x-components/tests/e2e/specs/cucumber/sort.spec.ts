import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('no special config for sort view', () => {
  cy.visit('/test/sort');
});

When(
  'sort option {string} is selected from the sort {string}',
  (sortOption: string, sortMenu: string) => {
    cy.getByDataTest('sort-' + sortMenu)
      .children()
      .contains(sortOption)
      .click();
  }
);
Then(
  'results are ordered accordingly with {string}',
  function (this: { resultsList: string[] }, sortOption: string) {
    cy.getByDataTest('result-item')
      .should('have.length.at.least', 1)
      .should($results => {
        const orderedResultsList = $results
          .toArray()
          .map(resultElement => resultElement.textContent);

        switch (sortOption) {
          case 'Relevance':
            expect(orderedResultsList).to.equal(this.resultsList);
            break;
          case 'nameSort asc': {
            const resultsListModified = [...this.resultsList].sort();
            expect(orderedResultsList).to.equal(resultsListModified);
            break;
          }
          case 'nameSort desc': {
            const resultsListModified = [...this.resultsList].sort().reverse();
            expect(orderedResultsList).to.equal(resultsListModified);
            break;
          }
        }
      });
  }
);
