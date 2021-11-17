import { SearchResponse } from '@empathyco/x-adapter';
import { And, Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { createResultStub } from '../../../src/__stubs__/results-stubs.factory';

Given('a results API with broken images', () => {
  cy.intercept('https://api.empathy.co/search', req => {
    req.reply(<SearchResponse>{
      banners: [],
      promoteds: [],
      redirections: [],
      facets: [],
      totalResults: 3,
      partialResults: [],
      spellcheck: '',
      queryTagging: {
        url: 'https://tagging.empathy.co',
        params: {}
      },
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
          images: ['https://notexistsimage1.com', 'https://notexistsimage2.com'],
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
      ]
    });
  }).as('interceptedFallbackResults');
});

Then('results display placeholder images before pertinent images are loaded', () => {
  cy.getByDataTest('result-picture').should('have.length', 3);
});

And(
  'result {int} with working image or mix of working and broken ones is displayed',
  (resultPicturePosition: number) => {
    cy.getByDataTest('result-picture')
      .eq(resultPicturePosition)
      .getByDataTest('result-picture-image')
      .should('exist');
  }
);

And('result {int} with broken images display a fallback image', (resultPicturePosition: number) => {
  cy.getByDataTest('result-picture')
    .eq(resultPicturePosition)
    .getByDataTest('result-picture-fallback')
    .should('exist');
});
