import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

// Scenario 1
Then('query tagging request should be triggered', () => {
  cy.wait('@queryTagging').should('exist')
})

// Scenario 3
When('add to cart button from first result is clicked', () => {
  cy.getByDataTest('add-to-cart').first().click()
})

When('first result is clicked', () => {
  cy.getByDataTest('result-link').first().click()
})

Then('result click tagging request is triggered', () => {
  cy.wait('@clickTagging').should('exist')
})

Then('add product to cart tagging request is triggered', () => {
  cy.wait('@addToCartTagging').should('exist')
})

// Scenario 4
When('scrolls down to next page', () => {
  cy.getByDataTest('result-link').last().scrollIntoView({ easing: 'linear', duration: 2000 })
})

Then('second page query tagging request is triggered', () => {
  cy.wait('@queryTagging').its('request.body').then(JSON.parse).should('have.property', 'page', 2)
})

Then('results page number {int} is loaded', (page: number) => {
  cy.getByDataTest('search-result').should('have.length', 24 * page)
})

// Scenario 5
When('pdp add to cart button is clicked', () => {
  cy.getByDataTest('pdp-add-to-cart-button').should('be.visible').click()
})

When('pdp is loaded', () => {
  cy.getByDataTest('pdp-add-to-cart-button').should('be.visible').should('have.length', 1)
})

// Scenario 6
/**
 * Here we use the right-click to avoid navigating to the result URL,
 * which was provoking the tracking to not be executed.
 */
When('first semantic query result is right clicked', () => {
  cy.getByDataTest('semantic-query-result').first().rightclick()
})

Then('display result click tagging request is triggered', () => {
  cy.wait('@displayClickTagging').should('exist')
})
