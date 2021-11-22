import { Then, When } from 'cypress-cucumber-preprocessor/steps';

let initialRelatedTags: string[] = [];

/**
 * Function to calculate if an element is visible inside a scroll.
 *
 * @param element - Is the child element.
 * @param scrollContainer - Is the parent container with the scroll.
 *
 * @returns True if the element inside the scroll is visible.
 */
function isElementVisible(element: HTMLElement, scrollContainer: HTMLElement): boolean {
  const { left, right } = element.getBoundingClientRect();
  const scrollContainerRect = scrollContainer.getBoundingClientRect();

  const isVisible =
    right <= scrollContainerRect.right
      ? scrollContainerRect.right - right <= scrollContainerRect.width
      : left - scrollContainerRect.left <= scrollContainerRect.width;

  return isVisible;
}

Then('{string} sliding panel arrow is displayed', (displayedArrows: string) => {
  switch (displayedArrows) {
    case 'left':
      cy.getByDataTest('sliding-panel-left-button').should('be.visible');
      cy.getByDataTest('sliding-panel-right-button').should('not.be.visible');
      break;
    case 'right':
      cy.getByDataTest('sliding-panel-right-button').should('be.visible');
      cy.getByDataTest('sliding-panel-left-button').should('not.be.visible');
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

When('{string} sliding panel arrow is clicked', (direction: string) => {
  cy.getByDataTest(`sliding-panel-${direction}-button`).click();
});

Then('wait for the movement of the elements inside the sliding panel', () => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100);
});

Then('only some related tags are visible', () => {
  initialRelatedTags = [];
  cy.getByDataTest('sliding-panel-scroll').then($scroll => {
    cy.getByDataTest('related-tag-item')
      .filter((_index, $element) => isElementVisible($element, $scroll.get(0)))
      .each($element => initialRelatedTags.push($element.get(0).textContent ?? ''));
  });
  cy.getByDataTest('sliding-panel-scroll')
    .getByDataTest('related-tag-item')
    .should('have.length.gt', initialRelatedTags.length);
});

Then('visible related tags have changed', () => {
  cy.getByDataTest('sliding-panel-scroll').then($scroll => {
    cy.getByDataTest('related-tag-item')
      .filter((_index, $element) => isElementVisible($element, $scroll.get(0)))
      .should($newRelatedTags => {
        const newRelatedTags = $newRelatedTags
          .map((_index, $relatedTag) => $relatedTag.textContent ?? '')
          .toArray();
        const areRelatedTagsDifferent = initialRelatedTags.some(
          relatedTag => !newRelatedTags.includes(relatedTag)
        );
        expect(areRelatedTagsDifferent).to.be.true;
      });
  });
});
