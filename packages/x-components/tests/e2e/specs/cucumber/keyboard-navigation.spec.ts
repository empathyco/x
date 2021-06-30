import { And, Given, Then, When, defineParameterType } from 'cypress-cucumber-preprocessor/steps';

defineParameterType({
  name: 'direction',
  regexp: /above|below|on the left|on the right/,
  transformer(stringValue) {
    return stringValue;
  }
});
type Direction = 'above' | 'below' | 'on the left' | 'on the right';

Given('no special config for keyboard-navigation view', () => {
  cy.visit('/test/keyboard-navigation');
});

// Scenario 1
And('search-box position is stored', () => {
  cy.getByDataTest('search-input').click().focused().as('originalElement');
});

And('right arrow is pressed {int} times', (pressedTimes: number) => {
  for (let i = 0; i < pressedTimes; i++) {
    cy.focused().trigger('keydown', { key: 'ArrowRight' });
  }
});

Then('next element position is "{direction}"', (expectedPosition: Direction) => {
  cy.focused().then($targetElement => {
    cy.get('@originalElement').should($originalElement => {
      switch (expectedPosition) {
        case 'on the right':
          expect($originalElement.offset()!.left).to.be.lessThan($targetElement.offset()!.left);
          break;
        case 'on the left':
          expect($originalElement.offset()!.left).to.be.greaterThan($targetElement.offset()!.left);
          break;
        case 'below':
          expect($originalElement.offset()!.top).to.be.lessThan($targetElement.offset()!.top);
          break;
        case 'above':
          expect($originalElement.offset()!.top).to.be.greaterThan($targetElement.offset()!.top);
          break;
      }
    });
  });
  cy.focused().as('originalElement');
});

When('down arrow is pressed {int} times', (pressedTimes: number) => {
  for (let i = 0; i < pressedTimes; i++) {
    cy.focused().trigger('keydown', { key: 'ArrowDown' });
  }
});

When('left arrow is pressed {int} times', (pressedTimes: number) => {
  for (let i = 0; i < pressedTimes; i++) {
    cy.focused().trigger('keydown', { key: 'ArrowLeft' });
  }
});

When('up arrow is pressed {int} times', (pressedTimes: number) => {
  for (let i = 0; i < pressedTimes; i++) {
    cy.focused().trigger('keydown', { key: 'ArrowUp' });
  }
});

// Scenario 2
Then('top out of bounds is reached', () => {
  cy.focused()
    .trigger('keydown', { key: 'ArrowLeft' })
    .trigger('keydown', { key: 'ArrowUp' })
    .then($targetElement => {
      cy.get('@originalElement').should($originalElement => {
        expect($originalElement.offset()!.left).to.be.eq($targetElement.offset()!.left);
      });
    });
});

When('clear history button position is stored', () => {
  cy.getByDataTest('clear-history-queries').focus().scrollIntoView().as('originalElement');
});

Then('bottom out of bounds is reached', () => {
  cy.focused()
    .trigger('keydown', { key: 'ArrowDown', force: true })
    .trigger('keydown', { key: 'ArrowRight', force: true })
    .then($targetElement => {
      cy.get('@originalElement').should($originalElement => {
        expect($originalElement[0]).to.be.eq($targetElement[0]);
      });
    });
});

// Scenario 3
When('tab key is pressed {int} times', (pressedTimes: number) => {
  for (let i = 0; i < pressedTimes; i++) {
    cy.focused().tab();
  }
  cy.focused().as('targetElement');
});

Then('focused element is different from previous one', () => {
  cy.get('@originalElement').should($originalElement => {
    expect($originalElement).not.to.be.eq('@targetElement');
  });
  cy.focused().as('originalElement');
});
