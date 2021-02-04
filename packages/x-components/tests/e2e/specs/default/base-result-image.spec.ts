describe('e2e testing base-result-image component', () => {
  beforeEach(() => {
    cy.visit('/result-app');
  });

  it('checks that placeholder will be replace for an image after scroll to bottom', () => {
    checksChildResultPicture('result-with-images', 'result-picture__image');
  });

  it('checks that placeholder will be replace for a fallback after scroll to bottom', () => {
    checksChildResultPicture('result-with-fail-images', 'result-picture__fallback');
  });

  it('checks that a right image loads when the rest fails after scroll to bottom', () => {
    checksChildResultPicture('result-with-fail-images-and-ok-images', 'result-picture__image');
  });
});

/**
 * Checks if the image's child load the correct images, switching from a
 * placeholder to a fallback or an image.
 *
 * @param componentDataTest - String of component data-test.
 * @param expectedDataTest - The data test expected.
 */
function checksChildResultPicture(componentDataTest: string, expectedDataTest: string): void {
  cy.getByDataTest(componentDataTest).children().as('resultPictureChild');
  cy.get('@resultPictureChild')
    .should('have.attr', 'data-test', 'result-picture__placeholder')
    .should('have.length', 1);
  cy.scrollTo('bottom', { easing: 'linear', duration: 500 });
  cy.get('@resultPictureChild', { timeout: 10000 })
    .should('have.attr', 'data-test', expectedDataTest)
    .should('have.length', 1);
}
