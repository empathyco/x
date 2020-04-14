import { getDataTestSelector } from '../../../src/__tests__/utils';

/**
 * Command implementation for {@link Cypress.Chainable.getByDataTest}.
 *
 * @param value - The data test attribute value to look for in the DOM.
 * @returns A Chainable object.
 * @internal
 */
Cypress.Commands.add('getByDataTest', (value: string) => cy.get(getDataTestSelector(value)));

/**
 * Command implementation for {@link Cypress.Chainable.searchQuery}.
 *
 * @param query - The query to search.
 * @returns A Chainable object.
 * @internal
 */
Cypress.Commands.add('searchQuery', (query: string) => cy.typeQuery(query).type('{enter}'));

/**
 * Command implementation for {@link Cypress.Chainable.typeQuery}.
 *
 * @param query - The query to type in the search input.
 * @returns A Chainable object.
 * @internal
 */
Cypress.Commands.add('typeQuery', (query: string) => cy.getByDataTest('search-input').type(query));
