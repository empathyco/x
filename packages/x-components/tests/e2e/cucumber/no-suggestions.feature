Feature: No Suggestions component

  Scenario Outline: 1. No suggestions is only displayed when there are no query suggestions
    Given no special config for no-suggestions view
    When  "<queryWithoutSuggestions>" is searched
    Then  no query suggestion are displayed
    And   no-suggestions message is displayed for "<queryWithoutSuggestions>"
    When  clear search button is pressed
    Then  no query suggestion are displayed
    And   no-suggestions message is not displayed
    When  "<queryWithSuggestions>" is searched
    Then  query suggestions are displayed
    And   no-suggestions message is not displayed
    When  clear search button is pressed
    And   "<queryWithoutSuggestions>" is searched
    Then  no query suggestion are displayed
    And   no-suggestions message is displayed for "<queryWithoutSuggestions>"

    Examples:
      | queryWithoutSuggestions | queryWithSuggestions |
      | asdfg                   | puzzle               |

