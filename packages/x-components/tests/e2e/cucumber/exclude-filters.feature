Feature: Exclude filters with no results component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API

  Scenario Outline: 1. Filters with total results = 0 are not shown
    Given no special config for exclude-filters view
    And   start button is clicked
    When  "<query>" is searched
    Then  only filters with totalResults undefined or greater than 0 are shown in facet "<facetName>"
    And   "<facetName>" total filters are more than displayed filters
    Examples:
      | query     | facetName   |
      | lego      | brand_facet |
