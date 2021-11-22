import { And, Then } from 'cypress-cucumber-preprocessor/steps';

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
