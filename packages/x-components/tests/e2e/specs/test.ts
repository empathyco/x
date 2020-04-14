import { getDataTestSelector } from '../../../src/__tests__/utils';

describe('my First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/');
    cy.get(getDataTestSelector('search-input')).should('exist');
  });
});
