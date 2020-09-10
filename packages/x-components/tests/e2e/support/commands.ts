/**
 * Command implementation for {@link Cypress.Chainable.getByDataTest}.
 *
 * @param value - The data test attribute value to look for in the DOM.
 * @returns A Chainable object.
 * @internal
 * TODO Investigate why importing the function from `src` makes build fail.
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
 * Command implementation for {@link Cypress.Chainable.searchQuery}.
 *
 * @param queries - The query to search.
 * @returns A Chainable object.
 * @internal
 */
Cypress.Commands.add('searchQueries', (...queries: string[]) => {
  queries.forEach(query => {
    cy.clearSearchInput();
    cy.typeQuery(query).type('{enter}');
  });
});

/**
 * Command implementation for {@link Cypress.Chainable.typeQuery}.
 *
 * @param query - The query to type in the search input.
 * @returns A Chainable object.
 * @internal
 */
Cypress.Commands.add('typeQuery', (query: string) => cy.getByDataTest('search-input').type(query));

/**
 * Command implementation for {@link Cypress.Chainable.focusSearchInput}.
 *
 * @returns A Chainable object.
 * @internal
 */
Cypress.Commands.add('focusSearchInput', () => cy.getByDataTest('search-input').click());

/**
 * Command implementation for {@link Cypress.Chainable.clearSearchInput}.
 *
 * @returns A Chainable object.
 * @internal
 */
Cypress.Commands.add('clearSearchInput', () => cy.getByDataTest('clear-search-input').click());
