Feature: Filters search component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a tracking API

  Scenario Outline: 1. Brand filters are updated based on regular and sifted queries
    Given no special config for layout view
    And   start button is clicked
    When  "<query>" is searched
    Then  facet has filters
    And   searchable filters are stored
    When  "<searchFiltersQuery>" is typed in the filters search input
    Then  filters in facet are refined with search, "<searchFiltersQuery>"
    And   searchable filters in facet contain refined filters

    Examples:
      | query  | searchFiltersQuery |
      | lego   | on                 |
