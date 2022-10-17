import { Then } from 'cypress-cucumber-preprocessor/steps';

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
        expect(Math.round(resultTop)).to.be.within(scrollTop - 1, scrollTop + 1);
        expect(resultBottom).to.be.gt(scrollTop);
      });
    });
});

Then('scroll position is at top', () => {
  cy.get('#main-scroll').should(scrollContainer => {
    expect(scrollContainer.scrollTop()).to.equal(0);
  });
});
