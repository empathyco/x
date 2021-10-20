Feature: Filters search component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API

  Scenario Outline: 1. Brand filters are updated based on regular and sifted queries
    Given no special config for base-filters-search view
    And   start button is clicked
    When  "<query>" is searched
    Then  filters for the searched query in "<facetName>" are displayed
    And   searchable "<facetName>" filters are stored
    When  "<siftedQuery>" is typed in the filters search input
    Then  filters in "<facetName>" are refined with sifted search, "<siftedQuery>"
    And   searchable filters in "<facetName>" contain refined filters
    Examples:
      | query | facetName   | siftedQuery |
      | juego | brand_facet | on          |
