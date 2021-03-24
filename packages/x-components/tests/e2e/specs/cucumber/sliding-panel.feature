Feature: Sliding panel component

  Scenario Outline: 1. Shows only needed arrow buttons and related tags change when those are clicked
    Given no special config for sliding-panel view
    When  "<query>" is searched
    Then  "right" sliding panel arrow is displayed
    And  only some related tags are visible
    When  right sliding panel arrow is clicked
    Then  visible related tags have changed
    And  "both" sliding panel arrow is displayed
    And  only some related tags are visible
    When  right sliding panel arrow is clicked
    Then  visible related tags have changed
    And  "left" sliding panel arrow is displayed
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


