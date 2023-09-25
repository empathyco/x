import { Then, When, defineParameterType } from '@badeball/cypress-cucumber-preprocessor';

defineParameterType({
  name: 'direction',
  regexp: /above|below|on the left|on the right/,
  transformer(stringValue) {
    return stringValue;
  }
});
type Direction = 'above' | 'below' | 'on the left' | 'on the right';
type Move = 'up' | 'right' | 'bottom' | 'left';

// Scenario 1
When('{string} element position is stored', (focusableElement: string) => {
  return cy.getByDataTest(focusableElement).last().focus().as('originalElement');
});

When('{string} arrow is pressed {int} times', (direction: Move, pressedTimes: number) => {
  Array.from({ length: pressedTimes }).forEach(() => {
    cy.focused().type(`{${direction}Arrow}`).as('originalElement');
  });
});

Then('empathize should be visible', () => {
  cy.getByDataTest('empathize').should('be.visible');
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
