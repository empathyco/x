Feature: Clear selected filters

  Background:
    Given a next queries API
    And   a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a recommendations API with a known response
    And   a results API with a known response
    And   a tracking API
    And   no special config for layout view
    And   start button is clicked
    And   empathize should be visible

  Scenario Outline: 1. Clear filters in aside panel
    When  "<query>" is searched
    Then  related results are displayed
    When  filter number <filter1> is clicked in facet "<facetName>"
    Then  filters "<filter1>" are shown in the selected filters list
    When   filter number <filter2> is clicked in facet "<facetName2>"
    Then  filters "<filter1>, <filter2>" are shown in the selected filters list
    When   filter number <filter3> is clicked in facet "<facetName3>"
    Then  filters "<filter1>, <filter2>, <filter3>" are shown in the selected filters list
    When  filter number 0 is clicked in selected filters list
    Then  filter is removed from selected filters list
    And   filters "<filter1>, <filter2>" are shown in the selected filters list
    When  clear filters button is clicked
    Then  no filters are selected
    And   spellcheck component is not shown

    Examples:
      | query | filter1 | filter2 | filter3 | facetName             | facetName2 | facetName3  |
      | lego  | 0       | 1       | 2       | hierarchical_category | age_facet  | price_facet |

  Scenario Outline: 2. Clear filters deleting the query
    When  "<query>" is searched
    Then  related results are displayed
    When  filter number <filter> is clicked in facet "<facetName>"
    And   filter number <filter2> is clicked in facet "<facetName2>"
    And   filter number <filter3> is clicked in facet "<facetName3>"
    Then  related results are displayed
    And   filters "<filter>, <filter2>, <filter3>" are shown in the selected filters list
    When  clear search button is pressed
    Then  no filters are selected

    Examples:
      | query | filter | filter2 | filter3 | facetName             | facetName2 | facetName3  |
      | lego  | 0      | 1       | 2       | hierarchical_category | age_facet  | price_facet |
