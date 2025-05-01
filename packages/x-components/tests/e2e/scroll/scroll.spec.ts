import { Then, When } from '@badeball/cypress-cucumber-preprocessor'

Then('url is updated with result {string}', (resultId: string) => {
  cy.url().should('contain', `scroll=${resultId}`)
})

Then('{string} result is visible', (resultId: string) => {
  cy.get(`[data-scroll=${resultId}]`).should('be.visible')
})

Then('scroll position is at top', () => {
  cy.get('#main-scroll').should(scrollContainer => {
    expect(scrollContainer.scrollTop()).to.equal(0)
  })
})

When('scrolling to top', () => {
  cy.get('#main-scroll').scrollTo('top', {
    easing: 'swing',
    duration: 1000,
    ensureScrollable: true,
  })
})

When('scrolling to bottom', () => {
  cy.get('#main-scroll').scrollTo('bottom', {
    easing: 'swing',
    duration: 1000,
    ensureScrollable: true,
  })
})

Then('scroll direction is UP', () => {
  cy.getByDataTest('main-scroll-UP').should('exist')
})

Then('scroll direction is DOWN', () => {
  cy.getByDataTest('main-scroll-DOWN').should('exist')
})
