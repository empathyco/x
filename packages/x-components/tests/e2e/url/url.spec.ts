import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

// Scenario 3
When('clicking result in position {int}', (index: number) => {
  cy.getByDataTest('result-link').eq(index).click()
})

// Scenario 4
Then("url doesn't contain parameter {string} with value {string}", (key: string, value: string) => {
  cy.location('search').should('not.contain', `${key}=${encodeURIComponent(value)}`)
})

When('selecting store {string}', (store: string) => {
  cy.getByDataTest('store-selector').getByDataTest('dropdown-toggle').click()
  cy.getByDataTest('store-selector').contains(store).click()
})
