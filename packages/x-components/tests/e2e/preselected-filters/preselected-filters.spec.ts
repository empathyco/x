import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { baseSnippetConfig } from '../../../src/views/base-config';

// Scenario 1
Given('an application with {string} filter preselected', (preselectedFilter: string) => {
  cy.visit('/', {
    onBeforeLoad(win) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      win.initX = {
        ...baseSnippetConfig,
        filters: [preselectedFilter]
      };
    }
  });
  // TODO: Check why we need to wait a few ms so the preselected are actually pushed into the url
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(60);
});

Then('filter {string} is selected', function (filterLabel: string) {
  cy.getByDataTest('selected-filters-list').should('contain.text', filterLabel);
});

// Scenario 2
Given('a URL with a filter parameter {string}', (filter: string) => {
  cy.visit('/', {
    qs: {
      filter
    }
  });
});

Then('filter {string} is not selected', function (filterLabel: string) {
  cy.getByDataTest('selected-filters-list').should('not.contain.text', filterLabel);
});
