Feature: MultiSelect filters component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API

  Scenario Outline: 1. Number of results and clear-filters button are updated accordingly when selecting multiple filters per facet
    Given no special config for layout view
    And   start button is clicked
    When  "<query>" is searched
    Then  related results are displayed
    When  waiting for search request intercept
    And   filter number <filterNumber1> is selected in facet "<facetName>"
    Then  selected filter is shown in the selected filters list
    And   search request contains selected filter
    When  waiting for search request intercept
    And   filter number <filterNumber2> is selected in facet "<facetName>"
  # TODO  https://searchbroker.atlassian.net/browse/EX-4866
  # Then  selected filter is shown in the selected filters list
    And   search request contains selected filter
  # TODO  https://searchbroker.atlassian.net/browse/EX-4866
  # And   clear-filters button displays the number of selected filters

    Examples:

      | query  | filterNumber1 | filterNumber2 | facetName    |
      | lego   | 3             | 1             | price_facet  |
