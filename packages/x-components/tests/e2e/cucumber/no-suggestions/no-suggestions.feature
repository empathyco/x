Feature: No Suggestions component

  Scenario Outline: 1. No suggestions is only displayed when there are no query suggestions
    Given a suggestion API with no results
    And   no special config for no-suggestions view
    When  "<queryWithoutSuggestions>" is searched
    Then  no query suggestion are displayed
    And   no-suggestions message is displayed for "<queryWithoutSuggestions>"
    Given a suggestion API with no results
    When  clear search button is pressed
    Then  no query suggestion are displayed
    And   no-suggestions message is not displayed
    Given a suggestions API
    When  "<queryWithSuggestions>" is searched
    Then  query suggestions are displayed
    And   no-suggestions message is not displayed
    Given a suggestion API with no results
    When  clear search button is pressed
    And   "<queryWithoutSuggestions>" is searched
    Then  no query suggestion are displayed
    And   no-suggestions message is displayed for "<queryWithoutSuggestions>"

    Examples:
      | queryWithoutSuggestions | queryWithSuggestions |
      | asdfg                   | puzzle               |

