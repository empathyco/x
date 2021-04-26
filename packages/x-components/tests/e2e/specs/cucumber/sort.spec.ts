import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

let defaultPriceResults: number[] = [];

/**
 * Check if price array is sorted in ascending or descending order.
 *
 * @param prices - Array of numbers to be ordered.
 * @param direction - Order to check; 'asc' as default, 'desc' for descending order.
 * @returns Boolean - If array is sorted or not based on the passed direction.
 */
function isSortedByPrice(prices: number[], direction: string): boolean {
  const limit = prices.length - 1;
  if (direction === 'desc') {
    // eslint-disable-next-line
    return prices.every((_value, index) => (index < limit ? prices[index] >= prices[index + 1] : true));
  } else if (direction === 'asc') {
    // eslint-disable-next-line
    return prices.every((_value, index) => (index < limit ? prices[index] <= prices[index + 1] : true));
  } else {
    return false;
  }
}

Given('no special config for sort view', () => {
  cy.visit('/test/sort');
});

Then('price results are stored by default order', () => {
  defaultPriceResults = [];
  cy.getByDataTest('result-price')
    .should('have.length.at.least', 1)
    .each($priceResult => {
      defaultPriceResults.push(Number($priceResult.text()));
    });
});

When(
  'sort option {string} is selected from the sort {string}',
  (sortOption: string, sortMenu: string) => {
    if (sortMenu === 'dropdown') {
      cy.getByDataTest(sortMenu + '-toggle').click();
    }
    cy.getByDataTest('sort-' + sortMenu)
      .children()
      .contains(sortOption)
      .click();
  }
);

Then('results are ordered accordingly with {string}', (sortOption: string) => {
  cy.getByDataTest('result-price')
    .should('have.length.at.least', 1)
    .should($results => {
      const orderedPriceResults = $results
        .toArray()
        .map(resultElement => Number(resultElement.textContent));

      switch (sortOption) {
        case 'Default':
          expect(orderedPriceResults).to.deep.equal(defaultPriceResults);
          break;
        case 'priceSort asc': {
          expect(isSortedByPrice(orderedPriceResults, 'asc')).to.be.true;
          break;
        }
        case 'priceSort desc': {
          expect(isSortedByPrice(orderedPriceResults, 'desc')).to.be.true;
          break;
        }
      }
    });
});
