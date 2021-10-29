Feature: Base events modal component

  Background:
    Given no special config for layout view
    When  start button is clicked

  Scenario: 1. Modal opens and closes when clicked out of its bounds
    Then  modal is opened
    When  clicking in a modal rendered component
    Then  modal is opened
    When  clicking outside modal slot content
    Then  modal is closed

  Scenario: 2. Modal opens and closes when clicking the close button
    Then  modal is opened
    When  clicking close modal button
    Then  modal is closed
