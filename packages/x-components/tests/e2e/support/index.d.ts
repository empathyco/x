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
    searchQuery(query: string): Chainable<any>;
    /**
     * Searches muliple queries by typing it in the search input and pressing enter.
     *
     * @example
     * cy.searchQueries('lego', 'palymobil')
     *
     * @param queries - The query to search.
     * @returns A Chainable object.
     * @internal
     */
    searchQueries(...queries: string[]): Chainable<any>;
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
    typeQuery(query: string): Chainable<any>;
    /**
     * Focus into the search input.
     *
     * @example
     * cy.focusSearchInput()
     *
     * @returns A Chainable object.
     * @internal
     */
    focusSearchInput(): Chainable<any>;
    /**
     * Clear search input.
     *
     * @example
     * cy.clearSearchInput()
     *
     * @returns A Chainable object.
     * @internal
     */
    clearSearchInput(): Chainable<any>;
  }
}
