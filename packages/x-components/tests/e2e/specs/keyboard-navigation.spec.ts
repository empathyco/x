describe('e2e testing keyboard-navigation spacial navigation functionality', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.searchQuery('lego');
    cy.visit('/');
    cy.getByDataTest('search-input').as('searchInput');
  });

  it(
    'navigates to the keyboard-navigation component from the search-input, through the' +
      ' elements in keyboard-navigation with arrow keys and back to the search-input navigating' +
      ' up out of the bounds of keyboard-navigation',
    () => {
      cy.get('@searchInput').type('{downarrow}');
      cy.focused()
        .as('entryElement')
        .then($entryElement => {
          cy.get('@searchInput').should($searchInput =>
            expect($searchInput.is($entryElement)).to.eq(false)
          );
        });

      cy.log('**navigates to other elements when clicking arrow keys**');
      cy.focused().trigger('keydown', { key: 'ArrowRight' });
      cy.focused().trigger('keydown', { key: 'ArrowRight' });
      cy.focused()
        .as('elementRightwards')
        .then($elementRightwards => {
          cy.get('@entryElement').should($entryElement => {
            expect($entryElement.is($elementRightwards)).to.eq(false);
            expect($entryElement.position().left).to.be.lessThan(
              $elementRightwards.position().left
            );
          });
        });

      cy.focused().trigger('keydown', { key: 'ArrowDown' });
      cy.focused().trigger('keydown', { key: 'ArrowDown' });
      cy.focused()
        .as('elementDownwards')
        .then($elementDownwards => {
          cy.get('@elementRightwards').should($elementRightwards => {
            expect($elementRightwards.is($elementDownwards)).to.eq(false);
            expect($elementRightwards.position().top).to.be.lessThan(
              $elementDownwards.position().top
            );
          });
        });

      cy.focused().trigger('keydown', { key: 'ArrowLeft' });
      cy.focused()
        .as('elementLeftwards')
        .then($elementLeftwards => {
          cy.get('@elementDownwards').should($elementDownwards => {
            expect($elementDownwards.is($elementLeftwards)).to.eq(false);
            expect($elementDownwards.position().left).to.be.greaterThan(
              $elementLeftwards.position().left
            );
          });
        });

      cy.log('**goes back to the search-input when navigating up out of bounds**');
      cy.focused().trigger('keydown', { key: 'ArrowUp' });
      cy.focused().trigger('keydown', { key: 'ArrowUp' });
      cy.focused().trigger('keydown', { key: 'ArrowUp' });
      cy.focused().trigger('keydown', { key: 'ArrowUp' });

      cy.focused().then($outOfBoundsElement => {
        cy.get('@searchInput').should($searchInput =>
          expect($searchInput.is($outOfBoundsElement)).to.eq(true)
        );
      });
    }
  );
});
