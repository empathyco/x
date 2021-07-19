import { And, Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { InstallXOptions } from '../../../src/x-installer/x-installer/types';

Given('following config: max items to store is {int}', (maxItemsToRequest: number) => {
  const config: InstallXOptions['xModules'] = {
    recommendations: {
      config: {
        maxItemsToRequest
      }
    }
  };
  cy.visit('/test/recommendations?useMockedAdapter=true', {
    qs: {
      xModules: JSON.stringify(config)
    }
  });
});

// Scenario 1
Then('suggestions should respond with mock {string}', (mockName: string) => {
  cy.intercept('POST', 'https:/*', {
    results: [{ mocked: mockName }]
  });
  /*
  cy.intercept('https://api.empathy.co/recommendations', req => {
    console.log('INTERCEPTED');
    //const request = JSON.parse(req.body); // Here we have the full request object that we sent
    // I don't do anything yet with the request, but we could maybe run some checks here?
    // Maybe post-process the mock with more data? I don't know So many possibilities
    import(`../mocks/${mockName}.ts`)
      .then(mock => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return mock.default();
      })
      .then(mockData => {
        req.reply(mockData); // And we send that response back to the browser.
      });
  });*/
});

Then(
  'number of displayed recommendations are equal or less than {int}',
  (maxItemsToRequest: number) => {
    cy.getByDataTest('recommendation-item')
      .should('have.length.at.least', 1)
      .and('have.length.at.most', maxItemsToRequest);
  }
);

And('each recommendation has an associated hyperlink containing image and text', () => {
  cy.getByDataTest('result-link').getByDataTest('recommendation-image').should('exist');
  cy.getByDataTest('result-link').getByDataTest('recommendation-text').should('exist');
});
