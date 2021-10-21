Feature: Base column pickers components

  Background:
    Given a recommendations API with a known response
    And   a results API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API

  Scenario Outline: 1. Column picker list and dropdown sets Recommendations and Results columns
    Given no special config for layout view
    And   start button is clicked
    Then  "recommendations" are displayed in "auto" columns
    When  "<query>" is searched
    Then  related results are displayed
    Then  results are displayed in "4" columns
    When  "<numberOfColumns1>" columns are selected from the column picker list
    Then  "results" are displayed in "<numberOfColumns1>" columns
    When  "<numberOfColumns2>" columns are selected from the column picker list
    Then  "results" are displayed in "<numberOfColumns2>" columns
    When  "<numberOfColumns3>" columns are selected from the column picker list
    Then  "results" are displayed in "<numberOfColumns3>" columns
    When  "<numberOfColumns1>" columns are selected from the column picker list
    Then  "results" are displayed in "<numberOfColumns1>" columns
    Examples:
      | query | numberOfColumns1 | numberOfColumns2 | numberOfColumns3 |
      | lego  | 6                | 4                | 0                |
