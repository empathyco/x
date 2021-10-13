import { Given, Then, And } from 'cypress-cucumber-preprocessor/steps';
import { getResultsStub } from '../../../../src/__stubs__';

// Background
Given('a results scroll API with a known response', () => {
  cy.intercept('https://api.empathy.co/search', req => {
    req.reply({
      results: getResultsStub(48),
      banners: [],
      promoteds: []
    });
  }).as('interceptedResults');
});

Given('following basic config', () => {
  cy.visit('/layout?useMockedAdapter=true', {});
});

Given('an url with scroll parameter', () => {
  cy.visit('/layout?useMockedAdapter=true&query=lego&page=4&scroll=product-25', {});
});

Then('scroll down the results', () => {
  cy.get('[data-scroll-id=product-32]').scrollIntoView();
});

And('the first element id in the scroll viewport is in the url', () => {
  cy.url().should('include', 'product-32');
});

And('the first element in the view is the scroll {int}', (id: number) => {
  cy.get(`[data-scroll-id=product-${id}]`)
    .should('be.visible')
    .then(() => {
      cy.get(`[data-scroll-id=product-${id - 1}]`).should('not.be.visible');
    });
});
