import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { every } from '../../../../src/utils/object';
import { Dictionary } from '../../../../src/utils/types';

Given('a URL with query parameter {string}', (query: string) => {
  cy.visit(`/?useMockedAdapter=true&q=${query}`);
});

Given('a navigator.sendBeacon API', () => {
  const sendBeaconCalls: SendBeaconCall[] = [];
  cy.on('window:before:load', win => {
    cy.stub(win.navigator, 'sendBeacon', (url, data) => {
      sendBeaconCalls.push({ url, params: JSON.parse(data) });
      return true;
    });
  });
  cy.wrap(sendBeaconCalls).as('sendBeaconCalls');
});

When('first result is clicked', () => {
  slowInteraction();
  cy.getByDataTest('result-link').first().click();
});

When('first promoted is clicked', () => {
  slowInteraction();
  cy.getByDataTest('promoted').first().click();
});

When('first banner is clicked', () => {
  slowInteraction();
  cy.getByDataTest('banner').first().click();
});

When('first redirection is clicked', () => {
  slowInteraction();
  cy.getByDataTest('redirection-link').first().should('exist', {}).click();
});

When('scrolls down to next page', () => {
  cy.getByDataTest('result-link').last().scrollIntoView({ easing: 'linear', duration: 2000 });
});

Then('result click tagging request is triggered', () => {
  cy.get<SendBeaconCall[]>('@sendBeaconCalls').should(haveBeenTrackedWith('click'));
});

Then('query tagging request should be triggered', () => {
  cy.get<SendBeaconCall[]>('@sendBeaconCalls').should(haveBeenTrackedWith('query'));
});

Then('query tagging request has been triggered', () => {
  cy.get<SendBeaconCall[]>('@sendBeaconCalls').then(haveBeenTrackedWith('query'));
});

Then('second page query tagging request is triggered', () => {
  cy.get<SendBeaconCall[]>('@sendBeaconCalls').should(haveBeenTrackedWith('query', { page: 2 }));
});

Then('results page number {int} is loaded', (page: number) => {
  cy.getByDataTest('search-result').should('have.length', 24 * page);
});

Then('result click tagging includes location {string}', location => {
  cy.get<SendBeaconCall[]>('@sendBeaconCalls').should(haveBeenTrackedWith('click', { location }));
});

Then('url matches {string}', (match: string) => {
  cy.location('pathname').should('match', new RegExp(match));
});

Then('add product to cart tagging request has been triggered', () => {
  cy.get<SendBeaconCall[]>('@sendBeaconCalls').should(haveBeenTrackedWith('add2cart'));
});

/**
 * Helper to check whether a tagging request has been made using the mocked adapter and the
 * `sendBeacon` API.
 *
 * @param taggingKind - Expected tagging kind.
 * @param expectedParams - Partial expected params of the tagging request.
 * @returns A should function that asserts that the tagging calls contain one entry with the given
 * parameters.
 */
function haveBeenTrackedWith(
  taggingKind: string,
  expectedParams: Dictionary<unknown> = {}
): (taggingCalls: SendBeaconCall[]) => void {
  return taggingCalls => {
    const taggingEndpointRegex = new RegExp(`track/${taggingKind}`);
    expect(
      taggingCalls.find(
        ({ url, params }) =>
          taggingEndpointRegex.test(url) &&
          every(expectedParams, (key, value) => params[key] === value)
      )
    ).not.to.be.equal(
      undefined,
      `Expected to find tracking request for "${taggingKind}" with parameters ${JSON.stringify(
        expectedParams,
        null,
        2
      )}.
 Triggered tracking requests: [${JSON.stringify(taggingCalls, null, 2)}].`
    );
  };
}

/**
 * Waits before performing the next iteration to ensure that the {@link XEvent}s quey has
 * been correctly processed.
 */
function slowInteraction(): void {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(250);
}

/**
 * Contains the base url and the parameters of a tagging request.
 */
interface SendBeaconCall {
  /** The base tagging url. */
  url: string;
  /** Parameters of the tagging request. This may include things like query, page, location... */
  params: Dictionary<unknown>;
}
