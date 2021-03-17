import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

const visibleRelatedTags: string[] = [];
const newVisibleRelatedTags: string[] = [];

Given('no special config for sliding-panel view', () => {
  cy.visit('/test/sliding-panel');
});

// Scenarios 1 and 2
Then('{string} sliding panel arrow is displayed', (displayedArrows: string) => {
  cy.getByDataTest('related-tag').should('be.visible');
  switch (displayedArrows) {
    case 'left':
      cy.getByDataTest('sliding-panel-left-button').should('be.visible');
      cy.getByDataTest('sliding-panel-right-button').should('not.be.visible');
      break;
    case 'right':
      cy.getByDataTest('sliding-panel-left-button').should('not.be.visible');
      cy.getByDataTest('sliding-panel-right-button').should('be.visible');
      break;
    case 'both':
      cy.getByDataTest('sliding-panel-left-button').should('be.visible');
      cy.getByDataTest('sliding-panel-right-button').should('be.visible');
      break;
    case 'no':
      cy.getByDataTest('sliding-panel-left-button').should('not.be.visible');
      cy.getByDataTest('sliding-panel-right-button').should('not.be.visible');
      break;
  }
});

When('right sliding panel arrow is clicked', () => {
  cy.getByDataTest('sliding-panel-right-button').click();
});

// Scenario 3
Then('only some related tags are visible', () => {
  cy.getByDataTest('related-tag').should('be.visible');
  cy.getByDataTest('related-tag').each($relatedTag => {
    if ($relatedTag.is(':visible')) {
      visibleRelatedTags.push($relatedTag.text());
    }
  });
});

Then('visible related tags have changed', () => {
  cy.getByDataTest('related-tag').eq(0).should('not.be.visible');
  cy.getByDataTest('related-tag')
    .each($newRelatedTag => {
      if ($newRelatedTag.is(':visible')) {
        newVisibleRelatedTags.push($newRelatedTag.text());
      }
    })
    .then(() => {
      expect(newVisibleRelatedTags === visibleRelatedTags).to.be.false;
    });
});
