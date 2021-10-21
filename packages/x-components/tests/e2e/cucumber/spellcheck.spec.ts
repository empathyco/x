import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('a results API response for a misspelled word', () => {
  cy.intercept('https://api.empathy.co/search', req => {
    req.reply({
      banners: [],
      promoteds: [],
      facets: [],
      results: [],
      totalResults: 7,
      spellcheck: 'lego'
    });
  });
});

Then(
  'spellcheck component is shown and its button contains the spellchecked query {string}',
  (spellcheckedQuery: string) => {
    cy.getByDataTest('spellcheck')
      .should('exist')
      .getByDataTest('set-spellcheck')
      .invoke('text')
      .should('eq', spellcheckedQuery);
  }
);

// Scenario 2
Then('spellcheck component is not shown', () => {
  cy.getByDataTest('spellcheck').should('not.exist');
});

// Scenario 3
When('spellcheck button is clicked', () => {
  cy.getByDataTest('set-spellcheck').click().invoke('text').as('spellcheckedQuery');
});

Then(
  'the spellchecked query is displayed in the search-box',
  function (this: { spellcheckedQuery: string }) {
    cy.getByDataTest('search-input').should('have.value', this.spellcheckedQuery);
  }
);

And('spellcheck button contains the spellchecked query {string}', (spellcheckedQuery: string) => {
  cy.getByDataTest('set-spellcheck').invoke('text').should('eq', spellcheckedQuery);
});
