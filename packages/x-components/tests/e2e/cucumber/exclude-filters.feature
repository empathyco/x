Feature: Exclude filters with no results component

  Scenario Outline: 1. Filters with total results = 0 are not shown
    Given no special config for exclude-filters view
    When  "<query>" is searched
    Then  filters with totalResults undefined or greater than 0 are shown
    And   price total filters are more than displayed filters
    Examples:
      | query     |
      | minnie    |
      | funko pop |
