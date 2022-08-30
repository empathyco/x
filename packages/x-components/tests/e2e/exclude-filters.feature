Feature: Exclude filters with no results component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a tracking API

  Scenario Outline: 1. Filters with total results = 0 are not shown
    Given no special config for layout view
    And   start button is clicked
    When  "<query>" is searched
    Then  only filters with totalResults undefined or greater than 0 are shown in facet
    And   "<facetName>" total filters are more than displayed filters

    Examples:
      | query     | facetName   |
      | lego      | brand_facet |
