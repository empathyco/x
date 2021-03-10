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
          expect($originalElement.position().left).to.be.lessThan($targetElement.position().left);
          break;
        case 'on the left':
          expect($originalElement.position().left).to.be.greaterThan(
            $targetElement.position().left
          );
          break;
        case 'below':
          expect($originalElement.position().top).to.be.lessThan($targetElement.position().top);
          break;
        case 'above':
          expect($originalElement.position().top).to.be.greaterThan($targetElement.position().top);
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
        expect($originalElement.position().left).to.be.eq($targetElement.position().left);
      });
    });
});

When('clear history button position is stored', () => {
  cy.getByDataTest('clear-history-queries').focus().as('originalElement');
});

Then('bottom out of bounds is reached', () => {
  cy.focused()
    .trigger('keydown', { key: 'ArrowDown' })
    .trigger('keydown', { key: 'ArrowRight' })
    .then($targetElement => {
      cy.get('@originalElement').should($originalElement => {
        expect($originalElement.position().left).to.be.eq($targetElement.position().left);
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
