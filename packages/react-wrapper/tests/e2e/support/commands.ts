// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable extends CustomCommands {}
}

/** Possible values for the view to render */
type ViewName = 'slots' | 'slotsComponents';

interface CustomCommands {
  /**
   * Selects a DOM element based on the `data-test` attribute value.
   *
   * @param selector - The selector to match with the `data-test` attribute.
   * @example cy.getByDataTest('my-button'); // Same as Cypress.get('[data-test="my-button"]');
   */
  getByDataTest(selector: string): Cypress.Chainable<JQuery>;

  /**
   * Loads the specified view.
   *
   * @param viewName - The view name to load.
   * @example cy.goToView('slots');
   */
  goToView(viewName: ViewName): Cypress.Chainable<Cypress.AUTWindow>;
}

const commands: CustomCommands = {
  getByDataTest(selector) {
    return cy.get(`[data-test="${selector}"]`);
  },
  goToView(viewName) {
    return cy.visit(`/?view=${viewName}`);
  }
};

Object.entries(commands).forEach(([commandName, command]) => {
  Cypress.Commands.add(commandName, command);
});
