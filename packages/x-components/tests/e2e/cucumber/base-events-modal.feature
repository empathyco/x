Feature: Base events modal component

  Scenario: 1. Modal opens and closes when clicked out of its bounds
    Given no special config for base-events-modal view
    When  open modal button is clicked
    Then  modal is opened
    When  clicking in a modal rendered component
    Then  modal is opened
    When  clicking outside modal slot content
    Then  modal is closed

  Scenario: 2. Modal opens and closes when clicking the close button
    Given no special config for base-events-modal view
    When  open modal button is clicked
    Then  modal is opened
    When  clicking close modal button
    Then  modal is closed
