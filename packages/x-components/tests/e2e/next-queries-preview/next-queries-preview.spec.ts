import { And, Given, Then } from 'cypress-cucumber-preprocessor/steps';

/**
 * Gets the name of the first Next Query to preview.
 *
 * @internal
 */
function getFirstNextQueryToPreview(): void {
  cy.wait(`@interceptedNextQueries`).then(interception => {
    cy.wrap(interception).as('firstNextQueryToPreview');
  });
}

// Scenario 1
Given(
  'following config: hide if equals query {int}, show only after offset {boolean}',
  (maxItemsToRender: number, showOnlyAfterOffset: boolean) => {
    cy.visit('/');
    cy.getByDataTest('nq-preview-max-to-render').clear().type(maxItemsToRender.toString());
    if (!showOnlyAfterOffset) {
      cy.getByDataTest('nq-preview-show-after-offset').uncheck();
    } else {
      cy.getByDataTest('nq-preview-show-after-offset').check();
    }
  }
);

Given('next queries preview name is shown and it is clickable', () => {
  getFirstNextQueryToPreview();
  cy.get('@firstNextQueryToPreview').then(firstNextQueryToPreview => {
    cy.getByDataTest('next-query-preview')
      .getByDataTest('next-query')
      .should('contain', firstNextQueryToPreview.response.body.nextQueries[0].query)
      .should('not.be.disabled');
  });
});

And('{int} results are shown for next queries preview', (maxItemsToRender: number) => {
  cy.getByDataTest('next-query-preview-result').should('have.length.at.most', maxItemsToRender);
});

// Scenario 2
And('{string} is clicked', (clickedItem: string) => {
  cy.getByDataTest(clickedItem).eq(0).click();
});

Then('new {string} URL is opened', (newURL: string) => {
  getFirstNextQueryToPreview();
  cy.get('@firstNextQueryToPreview').then(firstNextQueryToPreview => {
    if (newURL === 'results-page') {
      cy.location('search').should(
        'contain',
        firstNextQueryToPreview.response.body.nextQueries[0].query
      );
    } else if (newURL === 'pdp') {
      cy.location('pathname').should('contain', 'products');
    }
  });
});

// Scenario 3
And('next queries preview are displayed is {boolean}', (nextQueriesPreviewAreShown: boolean) => {
  cy.getByDataTest('next-query-preview').should(`${nextQueriesPreviewAreShown ? '' : 'not.'}exist`);
});
