Feature: Re-open search modal

  Scenario Outline:  1. Opens X Components modal after close it the first time
    Given a results API
    And   no special config for layout view
    And   start button is clicked
    When  "<query>" is searched
    Then  related results are displayed
    When  close modal button is clicked
    Then  related results are cleared
    When  start button is clicked
    And  "<query>" is searched
    Then  related results are displayed

Examples:
| query  |
| lego   |
