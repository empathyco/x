// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    /**
     * Gets a DOM element searching by its data-test attribute.
     *
     * @example
     * cy.getByDataTest('query-suggestion')
     *
     * @param value - The data test attribute value to look for in the DOM.
     * @returns A Chainable object.
     * @internal
     */
    getByDataTest(value: string): Chainable;
    /**
     * Searches a query by typing it in the search input and pressing enter.
     *
     * @example
     * cy.searchAQuery('lego')
     *
     * @param query - The query to search.
     * @returns A Chainable object.
     * @internal
     */
    searchQuery(query: string): Chainable;
    /**
     * Types a query into the search input.
     *
     * @example
     * cy.typeAQuery('lego')
     *
     * @param query - The query to type in the search input.
     * @returns A Chainable object.
     * @internal
     */
    typeQuery(query: string): Chainable;
  }
}

/**
 * Command implementation for {@link Cypress.Chainable.getByDataTest}.
 *
 * @param value - The data test attribute value to look for in the DOM.
 * @returns A Chainable object.
 * @internal
 */
Cypress.Commands.add('getByDataTest', (value: string) => cy.get(`[data-test=${value}]`));

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
