Feature: Sliding panel component

  Scenario Outline: 1. Shows only needed arrow buttons
    Given no special config for sliding-panel view
    When  "<query>" is searched
    Then  "right" sliding panel arrow is displayed
    When  right sliding panel arrow is clicked
    Then  "both" sliding panel arrow is displayed
    When  right sliding panel arrow is clicked
    Then  "left" sliding panel arrow is displayed
    Examples:
      | query |
      | lego  |

  Scenario Outline: 2. Hides unneeded arrow buttons when sliding panel content changes
    Given no special config for sliding-panel view
    When  "<query>" is searched
    Then  "right" sliding panel arrow is displayed
    When  clear search button is pressed
    And   "<secondQuery>" is searched
    Then  "no" sliding panel arrow is displayed
    When  clear search button is pressed
    And   "<query>" is searched
    Then  "right" sliding panel arrow is displayed
    When  related tag number <number> is clicked
    Then  "no" sliding panel arrow is displayed
    Examples:
      | query | secondQuery | number |
      | lego  | funko       | 1      |

  Scenario Outline: 3. Visible related tags change when arrow buttons are pressed
    Given no special config for sliding-panel view
    When  "<query>" is searched
    Then  only some related tags are visible
    When  right sliding panel arrow is clicked
    Then  visible related tags have changed
    Examples:
      | query |
      | lego  |




