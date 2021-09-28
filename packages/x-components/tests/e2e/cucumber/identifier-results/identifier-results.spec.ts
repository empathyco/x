import { And, Given } from 'cypress-cucumber-preprocessor/steps';
import { createResultStub } from '../../../../src/__stubs__/results-stubs.factory';

Given('an ID results API with a known response', () => {
  cy.intercept('https://api.empathy.co/searchById', req => {
    req.reply({
      results: [
        createResultStub('A0255072 - 9788467577112 - 160000', {
          images: ['https://picsum.photos/seed/20/100/100']
        }),
        createResultStub('A0273378 - 9788467579543 - 166664', {
          images: ['https://picsum.photos/seed/21/100/100']
        }),
        createResultStub('A0291017 - 9788467579536 - 166663', {
          images: ['https://picsum.photos/seed/22/100/100']
        }),
        createResultStub('A0246951 - 8437006044851 - 4001', {
          images: ['https://picsum.photos/seed/23/100/100']
        })
      ]
    });
  }).as('interceptedIDResults');
});

Given('an ID results API with no results', () => {
  cy.intercept('https://api.empathy.co/searchById', req => {
    req.reply({
      results: []
    });
  }).as('interceptedNoIDResults');
});

And('a results API with no results', () => {
  cy.intercept('https://api.empathy.co/search', req => {
    req.reply({
      results: []
    });
  }).as('interceptedNoResults');
});

And('no special config for identifier results view', () => {
  cy.visit('/?useMockedAdapter=true');
});
