import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

const mockedApiUrl = 'https://api.empathy.co';
const trackEndpoint = `${mockedApiUrl}/track`;

// Scenario 1
Given('a URL with query parameter {string}', (query: string) => {
  cy.visit(`/?useMockedAdapter=true&q=${query}`);
});

Then('query tagging request is triggered', () => {
  cy.intercept(trackEndpoint, req => {
    req.reply({});
  }).as('queryTagging');

  cy.wait('@queryTagging')
    .its('request.body')
    .then(JSON.parse)
    .should('have.property', 'url', 'https://analytics.com');
});

// Scenario 2
Given('click the first result', () => {
  cy.getByDataTest('result-link').first().rightclick();
});

Then('result click tagging request is triggered', () => {
  cy.intercept(trackEndpoint, req => {
    req.reply({});
  }).as('resultTagging');

  cy.wait('@resultTagging')
    .its('request.body')
    .then(JSON.parse)
    .should('have.property', 'url', 'http://x-components.com/tagging/click');
});
