import { When } from '@badeball/cypress-cucumber-preprocessor'

When('event ReloadSearchRequested is emitted', () => {
  // eslint-disable-next-line ts/no-unsafe-call
  cy.window().then((w: Window) => w.InterfaceX?.bus.emit('ReloadSearchRequested'))
})
