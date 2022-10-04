import { And, Given } from 'cypress-cucumber-preprocessor/steps';

Given('following config: hide if equals query {int}', (maxItemsToRender: number) => {
  cy.visit('/');
  cy.getByDataTest('nq-preview-max-to-render').clear().type(maxItemsToRender.toString());
});

// Scenario 1
Given('next queries preview name is shown and it is clickable', () => {
  cy.getByDataTest('next-query-preview').getByDataTest('next-query').should('contain', 'lego');
});

And('{int} results are shown for next queries preview', (maxItemsToRender: number) => {
  cy.getByDataTest('sliding-panel-scroll')
    .getByDataTest('next-query-preview-result')
    .should('have.length.at.most', maxItemsToRender);
});
