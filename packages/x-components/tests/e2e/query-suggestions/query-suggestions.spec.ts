import type { InstallXOptions } from '../../../src/x-installer/x-installer/types'
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor'

// Background
Given(
  'following config: hide if equals query {boolean}, requested items {int}',
  (hideIfEqualsQuery: boolean, maxItemsToRequest: number) => {
    const config: InstallXOptions['xModules'] = {
      querySuggestions: {
        config: {
          hideIfEqualsQuery,
          maxItemsToRequest,
        },
      },
      historyQueries: {
        config: {
          hideIfEqualsQuery: false,
        },
      },
    }
    cy.visit('/', {
      qs: {
        xModules: JSON.stringify(config),
      },
    })
  },
)

// Scenario 1
Then('no query suggestions are displayed', () => {
  cy.getByDataTest('query-suggestion').should('not.exist')
})

Then('at most {int} query suggestions are displayed', (maxItemsToRequest: number) => {
  cy.getByDataTest('query-suggestion')
    .should('have.length.at.least', 1)
    .and('have.length.at.most', maxItemsToRequest)
})

Then('all query suggestions contain the searched query', function () {
  const wordsInQuery = (this.searchedQuery as string).split(' ')
  cy.getByDataTest('query-suggestion').should(suggestions => {
    suggestions.each((_, e) => {
      for (const word of wordsInQuery) {
        expect(e).to.contain(word)
      }
    })
  })
})

// Scenario 2
When('query suggestion number {int} is clicked', (querySuggestionItem: number) => {
  cy.getByDataTest('query-suggestion')
    .eq(querySuggestionItem)
    .click()
    .invoke('text')
    .as('searchedQuery')
})

// Scenario 3
Then(
  '{string} term is not included as first query suggestion is {boolean}',
  (query: string, hideIfEqualsQuery: boolean) => {
    if (hideIfEqualsQuery) {
      cy.getByDataTest('query-suggestion').first().should('not.have.text', query)
    } else {
      cy.getByDataTest('query-suggestion').first().should('have.text', query)
    }
  },
)
