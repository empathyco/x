import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('url is updated with result {string}', (resultId: string) => {
  cy.url().should('contain', `scroll=${resultId}`);
});

Then('{string} result is visible', (resultId: string) => {
  cy.get(`[data-scroll=${resultId}]`).should('be.visible');
});

Then('scroll position is at top', () => {
  cy.get('#main-scroll').should(scrollContainer => {
    expect(scrollContainer.scrollTop()).to.equal(0);
  });
});
