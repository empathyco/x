Feature: Keyboard navigation component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API

  Scenario Outline: 1. Navigating with arrow keys
    Given no special config for layout view
    And   start button is clicked
    When  "<query>" is searched
    And   related results are displayed
    And   "<focusableElement>" element position is stored
    And   "right" arrow is pressed 1 times
    Then  next element position is "on the right"
    When  "down" arrow is pressed 2 times
    Then  next element position is "below"
    When  "left" arrow is pressed 3 times
    Then  next element position is "on the left"
    When  "up" arrow is pressed 1 times
    Then  next element position is "above"
    When  "right" arrow is pressed 1 times
    Then  next element position is "on the right"

    Examples:
      | query | focusableElement |
      | lego  | search-input     |

  Scenario Outline: 2. Not navigating out of bounds
    Given no special config for layout view
    And   start button is clicked
    When  "<query>" is searched
    And   related results are displayed
    And   "<focusableElement>" element position is stored
    Then  top out of bounds is reached

    Examples:
      | query | focusableElement |
      | lego  | search-input     |





