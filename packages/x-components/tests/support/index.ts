import type { AnyFunction } from '@empathyco/x-utils'
import { mount } from 'cypress/vue'
import { XDummyBus } from '../../src/__tests__/bus.dummy'
import { e2eAdapter } from '../../src/adapter/e2e-adapter'
import { XPlugin } from '../../src/plugins/x-plugin'

import CommandFns = Cypress.CommandFns
import Loggable = Cypress.Loggable
import Shadow = Cypress.Shadow
import Timeoutable = Cypress.Timeoutable
import Withinable = Cypress.Withinable

declare global {
  // eslint-disable-next-line ts/no-namespace
  namespace Cypress {
    interface Chainable extends CustomCommands, CustomDualCommands {
      mount: typeof mount
    }
  }
}

interface CustomCommands extends CommandFns {
  /**
   * Searches a query by typing it in the search input and pressing enter.
   *
   * @example
   * cy.searchAQuery('lego')
   *
   * @param query - The query to search.
   * @returns A Chainable object.
   */
  searchQuery: (query: string) => Cypress.Chainable<JQuery>

  /**
   * Searches multiple queries by typing it in the search input and pressing enter.
   *
   * @example
   * cy.searchQueries('lego', 'palymobil')
   *
   * @param queries - The query to search.
   * @returns A Chainable object.
   */
  searchQueries: (...queries: string[]) => void

  /**
   * Types a query into the search input.
   *
   * @example
   * cy.typeAQuery('lego')
   *
   * @param query - The query to type in the search input.
   * @returns A Chainable object.
   */
  typeQuery: (query: string) => Cypress.Chainable<JQuery>

  /**
   * Replaces the query in the search input.
   *
   * @example
   * cy.replaceQuery('lego')
   *
   * @param query - The query to type in the search input.
   * @returns A Chainable object.
   */
  replaceQuery: (query: string) => Cypress.Chainable<JQuery>

  /**
   * Focus into the search input.
   *
   * @example
   * cy.focusSearchInput()
   *
   * @returns A Chainable object.
   */
  focusSearchInput: () => Cypress.Chainable<JQuery>

  /**
   * Clear search input.
   *
   * @example
   * cy.clearSearchInput()
   *
   * @returns A Chainable object.
   */
  clearSearchInput: () => Cypress.Chainable<JQuery>

  /**
   * Retrieves a filter by its label.
   *
   * @param label - The text of the filter label to retrieve.
   * @returns A Chainable object that contains the asserted filter `HTMLElement`.
   */
  getFilterWithLabel: (label: string) => Cypress.Chainable<JQuery>

  /**
   * Retrieves the filters that are selected.
   *
   * @returns A Chainable object that contains the `HTMLElement`s of the filters that are selected.
   */
  getSelectedFilters: () => Cypress.Chainable<JQuery>

  /**
   * Clicks a filter with the provided text. It saves it to an alias if provided, and asserts
   * if it its selected.
   *
   * @param label - The text of the filter label to click.
   * @param options - Some options to do with the filter.
   * @returns A Chainable object that contains the clicked filter `HTMLElement`.
   */
  clickFilterWithLabel: (label: string, options?: ClickFilterOptions) => Cypress.Chainable<JQuery>

  /**
   * Checks that the filter with the provided label is selected or unselected.
   *
   * @param label - The text of the filter label to check.
   * @param status - A string describing if the filter is selected or not.
   * @returns A Chainable object that contains the asserted filter `HTMLElement`.
   */
  assertFilterIs: (label: string, status: SelectedStatus) => Cypress.Chainable<JQuery>

  /**
   * Waits for the results to update by checking the existence of a loading item.
   */
  waitForResultsToRender: () => void

  /**
   * Checks if next-queries should contain or not a certain term.
   *
   * @param query - The query which should be checked.
   * @param toContain - Determines if the query should be contained within the next queries or not.
   */
  checkNextQueries: (query: string, toContain: boolean) => void
}

interface CustomDualCommands extends CommandFns {
  /**
   * Gets a DOM element searching by its data-test attribute.
   *
   * @example
   * cy.getByDataTest('query-suggestion')
   *
   * @param value - The data test attribute value to look for in the DOM.
   * @param options - The options passed to the Cypress command.
   * @returns A Chainable object.
   */
  getByDataTest: (value: string, options?: CypressCommandOptions) => Cypress.Chainable<JQuery>
}

type AddPreviousParam<Functions extends Record<keyof Functions, AnyFunction>> = {
  [Key in keyof Functions]: (
    previous: unknown,
    ...args: Parameters<Functions[Key]>
  ) => ReturnType<Functions[Key]>
}

type SelectedStatus = 'selected' | 'unselected'

interface ClickFilterOptions {
  filterShouldBe?: SelectedStatus
}

export type CypressCommandOptions = Partial<Loggable & Timeoutable & Withinable & Shadow>

const customCommands: CustomCommands = {
  searchQuery: query => cy.typeQuery(query).type('{enter}'),
  searchQueries: (...queries) => {
    queries.forEach(query => {
      cy.clearSearchInput()
      cy.searchQuery(query)
      cy.waitForResultsToRender()
    })
  },
  typeQuery: query => cy.getByDataTest('search-input').type(query),
  replaceQuery: query => cy.getByDataTest('search-input').type(`{selectAll}${query}`),
  focusSearchInput: () => cy.getByDataTest('search-input').click(),
  clearSearchInput: () => cy.getByDataTest('clear-search-input').click(),
  getFilterWithLabel(label) {
    return cy.getByDataTest('filter').contains(label)
  },
  clickFilterWithLabel(label, options = {}) {
    const chain = cy.getFilterWithLabel(label).click()
    if (options.filterShouldBe !== undefined) {
      cy.assertFilterIs(label, options.filterShouldBe)
    }
    return chain
  },
  assertFilterIs(label, selectedStatus) {
    const selectedClass = 'x-selected'
    if (selectedStatus === 'selected') {
      return cy
        .getFilterWithLabel(label)
        .should('have.attr', 'aria-checked', 'true')
        .and('have.class', selectedClass)
    } else {
      return cy
        .getFilterWithLabel(label)
        .should('have.attr', 'aria-checked', 'false')
        .and('not.have.class', selectedClass)
    }
  },
  getSelectedFilters() {
    return cy.get('.x-selected')
  },
  waitForResultsToRender() {
    cy.getByDataTest('search-result').should('be.visible')
  },
  checkNextQueries(query: string, toContain: boolean) {
    cy.getByDataTest('next-query').should(queries => {
      queries.each((_, e) => {
        if (toContain) {
          expect(e).to.contain(query)
        } else {
          expect(e).to.not.contain(query)
        }
      })
    })
  },
}

const customDualCommands: AddPreviousParam<CustomDualCommands> = {
  getByDataTest: (previous, value, options?: CypressCommandOptions) => {
    const selector = `[data-test=${value}]`
    return previous ? cy.wrap(previous).find(selector, options) : cy.get(selector, options)
  },
}

Cypress.Commands.addAll(customCommands)
Cypress.Commands.addAll({ prevSubject: 'optional' }, customDualCommands)

Cypress.Commands.add('mount', (component, options = {}) => {
  options.global = options.global ?? {}
  options.global.plugins = options.global.plugins ?? []
  options.global.plugins.push([new XPlugin(new XDummyBus()), { adapter: e2eAdapter }])

  return mount(component, options)
})
