import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('a URL with query parameter {string}', (query: string) => {
  cy.visit(`/?useMockedAdapter=true&q=${query}`);
});

Given('navigator.sendBeacon API', () => {
  const beaconCalls: string[] = [];
  cy.on('window:before:load', win => {
    cy.stub(win.navigator, 'sendBeacon', url => {
      beaconCalls.push(url);
      return true;
    });
  });
  cy.wrap(beaconCalls).as('beacon');
});

When('first result is clicked', () => {
  cy.getByDataTest('result-link').first().click();
});

When('first promoted is clicked', () => {
  cy.getByDataTest('promoted').first().click();
});

When('first banner is clicked', () => {
  cy.getByDataTest('banner').first().click();
});

When('first redirection is clicked', () => {
  cy.getByDataTest('redirection-link').first().click();
});

When('scrolls down to next page', () => {
  cy.getByDataTest('result-link').last().scrollIntoView({ easing: 'linear', duration: 2000 });
});

Then('result click tagging request is triggered', () => {
  cy.get<string[]>('@beacon').should(sendBeacon => {
    expect(!!sendBeacon.find(url => /track\/click/.test(url))).to.be.true;
  });
});

Then('query tagging request should be triggered', () => {
  cy.get<string[]>('@beacon').should(sendBeacon => {
    expect(!!sendBeacon.find(url => /track\/query/.test(url))).to.be.true;
  });
});

Then('query tagging request has been triggered', () => {
  cy.get<string[]>('@beacon').should(sendBeacon => {
    expect(!!sendBeacon.find(url => /track\/query/.test(url))).to.be.true;
  });
});

Then('second page query tagging request is triggered', () => {
  cy.get<string[]>('@beacon').should(sendBeacon => {
    expect(!!sendBeacon.find(url => /track\/query/.test(url))).to.be.true;
  });
});

Then('results page number {int} is loaded', (page: number) => {
  cy.getByDataTest('search-result').should('have.length', 24 * page);
});

Then('result click tagging includes location {string}', () => {
  cy.get<string[]>('@beacon').should(sendBeacon => {
    expect(!!sendBeacon.find(url => /track\/click/.test(url))).to.be.true;
  });
});

Then('url matches {string}', (match: string) => {
  cy.location('pathname').should('match', new RegExp(match));
});

Then('add product to cart tagging request has been triggered', () => {
  cy.get<string[]>('@beacon').should(sendBeacon => {
    expect(!!sendBeacon.find(url => /track\/add2cart/.test(url))).to.be.true;
  });
});
