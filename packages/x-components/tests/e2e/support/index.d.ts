declare namespace Cypress {
  interface Chainable<Subject> {
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
    getByDataTest(value: string): Chainable<any>;
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
    searchQuery(query: string): Chainable<Subject>;
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
    typeQuery(query: string): Chainable<Subject>;
  }
}
