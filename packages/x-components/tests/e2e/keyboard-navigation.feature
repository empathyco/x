Feature: Keyboard navigation component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a tracking API
    And   no special config for layout view
    And   start button is clicked
    And   "lego" is searched

  Scenario Outline: 1. Navigating with arrow keys
    When  "<focusableElement>" element position is stored
    And   "right" arrow is pressed 1 times
    Then  next element position is "on the right"
    When  "left" arrow is pressed 1 times
    Then  next element position is "on the left"
    When  "down" arrow is pressed 1 times
    Then  next element position is "below"
    When  "left" arrow is pressed 1 times
    Then  next element position is "on the left"
    When  "right" arrow is pressed 3 times
    Then  next element position is "on the right"
    When  "up" arrow is pressed 1 times
    Then  next element position is "above"

    Examples:
      | focusableElement |
      | search-input     |

  Scenario Outline: 2. Not navigating out of bounds
    When  "<focusableElement>" element position is stored
    Then  top out of bounds is reached
    When  "<focusableElement2>" element position is stored
    Then  bottom out of bounds is reached

    Examples:
      | focusableElement | focusableElement2 |
      | search-input     | next-query        |





