import { Then, When } from 'cypress-cucumber-preprocessor/steps';

When(
  'sort option {string} is selected from the sort {string}',
  (sortOption: string, sortMenu: string) => {
    if (sortMenu === 'dropdown') {
      cy.getByDataTest(sortMenu + '-toggle').click();
    }
    cy.getByDataTest('sort-' + sortMenu)
      .children()
      .contains(sortOption)
      .click();
  }
);

Then('search request contains the selected sort {string}', (sortOption: string) => {
  cy.wait('@requestWithFilter')
    .its('request.body')
    .then(body => {
      if (sortOption === 'default') {
        sortOption = '';
      }
      expect(body).to.contain(`"sort":"${sortOption}"`);
    });
});
