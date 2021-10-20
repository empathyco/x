Feature: Keyboard navigation component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API

  Scenario Outline: 1. Navigating with arrow keys
    Given no special config for keyboard-navigation view
    And   start button is clicked
    When  "<query>" is searched
    And   related results are displayed
    And   "<focusableElement>" element position is stored
    And   right arrow is pressed 1 times
    Then  next element position is "on the right"
    When  down arrow is pressed 2 times
    Then  next element position is "below"
    When  right arrow is pressed 1 times
    Then  next element position is "on the right"
    When  left arrow is pressed 1 times
    Then  next element position is "on the left"
    When  up arrow is pressed 1 times
    Then  next element position is "above"

    Examples:
      | query | focusableElement |
      | lego  | search-input     |

  Scenario Outline: 2. Not navigating out of bounds
    Given no special config for keyboard-navigation view
    And   start button is clicked
    When  "<query>" is searched
    And   related results are displayed
    And   "<focusableElement>" element position is stored
    Then  top out of bounds is reached
    When  clear history button position is stored
    Then  bottom out of bounds is reached

    Examples:
      | query | focusableElement |
      | lego  | search-input     |

  Scenario Outline: 3. Navigating with tab key
    Given no special config for keyboard-navigation view
    And   start button is clicked
    When  "<query>" is searched
    And   related results are displayed
    And   "<focusableElement>" element position is stored
    When  tab key is pressed 2 times
    Then  focused element is different from previous one
    When  tab key is pressed 25 times
    Then  focused element is different from previous one
    When  tab key is pressed 10 times
    Then  focused element is different from previous one

    Examples:
      | query | focusableElement      |
      | lego  | base-id-toggle-button |





