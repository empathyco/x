Feature: Search sort components

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API
    And   no special config for layout view
    And   start button is clicked

  Scenario Outline: 1. Search sort list and dropdown order the results
    When  "<query>" is searched
    Then  related results are displayed
    When  waiting for search request intercept
    And   sort option "<sortOption2>" is selected from the sort "dropdown"
    Then  search request contains the selected sort "<sortOption2>"
    When  waiting for search request intercept
    And   sort option "<sortOption1>" is selected from the sort "dropdown"
    Then  search request contains the selected sort "<sortOption1>"
    When  waiting for search request intercept
    And   sort option "<sortOption3>" is selected from the sort "dropdown"
    Then  search request contains the selected sort "<sortOption3>"

    Examples:
      | query  | sortOption1    | sortOption2     | sortOption3 |
      | lego   | priceSort asc  | priceSort desc  | default     |
