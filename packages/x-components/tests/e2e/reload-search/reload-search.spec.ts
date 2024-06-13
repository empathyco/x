import { When } from '@badeball/cypress-cucumber-preprocessor';

When('event ReloadSearchRequested is emitted', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  cy.window().then((w: Window) => w.InterfaceX?.bus.emit('ReloadSearchRequested'));
});
