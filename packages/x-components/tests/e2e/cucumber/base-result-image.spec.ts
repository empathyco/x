import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { createResultStub } from '../../../src/__stubs__/results-stubs.factory';

Given('a results API with fallback images', () => {
  cy.intercept('https://api.empathy.co/search', req => {
    req.reply({
      banners: [],
      promoteds: [],
      facets: [],
      results: [
        createResultStub('Result 1', {
          images: ['https://picsum.photos/seed/18/100/100', 'https://picsum.photos/seed/2/100/100'],
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          }
        }),
        createResultStub('Result 2', {
          images: ['product-002-01.jpg', 'product-002-02.jpg'],
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          }
        }),
        createResultStub('Result 3', {
          images: [
            'https://notexistsimage1.com',
            'https://notexistsimage2.com',
            'https://notexistsimage3.com',
            'https://picsum.photos/seed/20/100/100'
          ],
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          }
        })
      ],
      totalResults: 3
    });
  }).as('interceptedFallbackResults');
});

Then(
  'placeholder {int} is replaced for {string}',
  (placeholderIndexItem: number, loadedContent: string) => {
    cy.get('.x-result-picture')
      .eq(placeholderIndexItem)
      .should('not.contain', 'placeholder')
      .getByDataTest(loadedContent)
      .should('exist');
  }
);
