Feature: Keyboard navigation component

  Scenario Outline: 1. Navigating with arrow keys
    Given no special config for keyboard-navigation view
    When  "<query>" is searched
    And   related results are displayed
    And   search-box position is stored
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
      | query |
      | lego  |

    Scenario Outline: 2. Navigating out of bounds
      Given no special config for keyboard-navigation view
      When  "<query>" is searched
      And   related results are displayed
      And   search-box position is stored
      Then  top out of bounds is reached
      When  clear history button position is stored
      Then  bottom out of bounds is reached

      Examples:
        | query |
        | lego  |

    Scenario Outline: 3. Navigating with tab key
      Given no special config for keyboard-navigation view
      When  "<query>" is searched
      And   related results are displayed
      And   search-box position is stored
      When  tab key is pressed 2 times
      Then  focused element is different from previous one
      When  tab key is pressed 8 times
      Then  focused element is different from previous one
      When  tab key is pressed 40 times
      Then  focused element is different from previous one
      When  tab key is pressed 8 times
      Then  focused element is different from previous one

      Examples:
        | query |
        | lego  |




