import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

let relatedTagsList: string[] = [];
const secondRelatedTagsList: string[] = [];

// Scenario 1
Given(
  'following config: requested items {int}, add to search-box {boolean}',
  (maxItemsToRequest: number, addToSearchBox: boolean) => {
    const config = {
      relatedTags: {
        config: {
          maxItemsToRequest: maxItemsToRequest,
          addToSearchBox: addToSearchBox
        }
      }
    };

    cy.visit('/', {
      qs: {
        xModules: JSON.stringify(config)
      }
    });
  }
);

Then('at most {int} unselected related tags are displayed', (maxItemsToRequest: number) => {
  relatedTagsList = [];
  cy.getByDataTest('related-tag')
    .not('.x-related-tag--is-selected')
    .should('have.length.at.most', maxItemsToRequest);
  cy.getByDataTest('related-tag')
    .should('have.length.at.least', 1)
    .each($result => {
      relatedTagsList.push($result.text());
    });
});

Then(
  'clicked related tag is shown in position {int} as selected',
  function (relatedTagPosition: number) {
    cy.getByDataTest('related-tag')
      .eq(relatedTagPosition)
      .should('have.text', this.clickedRelatedTag)
      .should('have.class', 'x-related-tag--is-selected');
  }
);

Then(
  'clicked related tag is added to the search-box is {boolean}',
  function (addToSearchBox: boolean) {
    const query: string = this.searchedQuery;
    const tag: string = this.clickedRelatedTag;
    if (addToSearchBox) {
      cy.getByDataTest('search-input').should('contain', `${query} ${tag}`);
    } else {
      cy.getByDataTest('search-input').should('not.contain', `${query} ${tag}`);
    }
  }
);

Then('related tag number {int} is shown as not selected', (relatedTagItem: number) => {
  cy.getByDataTest('related-tag')
    .eq(relatedTagItem)
    .should('not.have.class', 'x-related-tag--is-selected');
});

Then('raw related results are displayed', () => {
  cy.getByDataTest('search-result').should('have.length', 4);
});

// Scenario 2
Then('related tags have changed', () => {
  cy.getByDataTest('related-tag')
    .should('have.length.at.least', 2)
    .each($result => {
      secondRelatedTagsList.push($result.text());
    })
    .then(() => {
      expect(secondRelatedTagsList === relatedTagsList).to.be.false;
    });
});

Then('clicked related tag is not displayed but at least one remains', function () {
  cy.getByDataTest('related-tag').should('not.contain', this.clickedRelatedTag);
  cy.getByDataTest('related-tag').eq(0).should('have.class', 'x-related-tag--is-selected');
});

// Scenario 3
Then('no related tags are displayed', () => {
  cy.getByDataTest('related-tag').should('not.exist');
});
