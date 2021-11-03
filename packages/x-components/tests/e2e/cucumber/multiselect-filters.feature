Feature: MultiSelect filters component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API
    And   no special config for layout view
    And   start button is clicked

  Scenario Outline: 1. Number of results and clear-filters button are updated accordingly when selecting multiple filters per facet
    When  "<query>" is searched
    Then  related results are displayed
    When  waiting for search request intercept
    And   filter "<filter1>" is clicked in facet "<facetName>"
    Then  filter "<filter1>" is shown in the selected filters list
    And   search request contains "<filter1>" filter
    When  waiting for search request intercept
    And   filter "<filter2>" is clicked in facet "<facetName>"
    Then  filter "<filter1>" is shown in the selected filters list
    And   filter "<filter2>" is shown in the selected filters list
    And   search request contains "<filter1>" filter
    And   search request contains "<filter2>" filter
    And   clear-filters button should have <totalSelectedFilters> filters selected

    Examples:
      | query | filter1       | filter2       | facetName   | totalSelectedFilters |
      | lego  | From 30 to 40 | From 10 to 20 | price_facet | 2                    |
