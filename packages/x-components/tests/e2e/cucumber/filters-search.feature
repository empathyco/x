Feature: Filters search component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API

  Scenario Outline: 1. Brand filters are updated based on regular and sifted queries
    Given no special config for layout view
    And   start button is clicked
    When  "<query>" is searched
    Then  facet "<facetName>" has filters
    And   searchable "<facetName>" filters are stored
    When  "<searchFiltersQuery>" is typed in the filters search input
    Then  filters in "<facetName>" are refined with search, "<searchFiltersQuery>"
    And   searchable filters in "<facetName>" contain refined filters
    Examples:
      | query | facetName   | searchFiltersQuery |
      | juego | brand_facet | on                 |
