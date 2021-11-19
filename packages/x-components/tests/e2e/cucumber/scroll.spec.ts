import { Then, When } from 'cypress-cucumber-preprocessor/steps';

When('scrolling down to result {string}', (resultId: string) => {
  cy.get(`[data-scroll=${resultId}]`).scrollIntoView({ easing: 'swing', duration: 1000 });
});

Then('url is updated with result {string}', (resultId: string) => {
  cy.url().should('contain', `scroll=${resultId}`);
});

Then('first visible result is {string}', (resultId: string) => {
  cy.get(`[data-scroll=${resultId}]`)
    .should('be.visible')
    .then($result => {
      const resultTop = $result.offset()!.top;
      const resultBottom = resultTop + $result.height()!;
      cy.get('#main-scroll').then($scroll => {
        const scrollTop = $scroll.offset()!.top;
        expect(resultTop).to.be.lte(scrollTop);
        expect(resultBottom).to.be.gt(scrollTop);
      });
    });
});
