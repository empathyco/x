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

  Scenario Outline: 1. Clear filters with clear filters button
    When  "<query>" is searched
    And   filter number <filter1> is clicked in facet "<facetName>"
    And   filter number <filter2> is clicked in facet "<facetName2>"
    And   filter number <filter3> is clicked in facet "<facetName3>"
    Then  related results are displayed
    And   filters "<filter1>, <filter2>, <filter3>" are shown in the selected filters list
    When  clear filters button is clicked
    Then  no filters are selected
    And   spellcheck component is not shown

    Examples:
      | query | filter1 | filter2 | filter3 | facetName              | facetName2 | facetName3  |
      | lego  | 0       | 1       | 2       | hierarchical_category  | age_facet  | price_facet |

  Scenario Outline: 2. Clear filters deleting the query
    When  "<query>" is searched
    And   filter number <filter> is clicked in facet "<facetName>"
    And   filter number <filter> is clicked in facet "<facetName2>"
    And   filter number <filter> is clicked in facet "<facetName3>"
    Then  related results are displayed
    When  clear search button is pressed
    Then  no filters are selected

    Examples:
      | query | filter | facetName    | facetName2 | facetName3  | maxItemsToRequest |
      | lego  | 0      | brand_facet  | age_facet  | price_facet | 5                 |

  Scenario Outline: 3. Remove single filter
    When  "<query>" is searched
    And   filter number <filter> is clicked in facet "<facetName>"
    And   filter number <filter> is clicked in facet "<facetName2>"
    And   filter number <filter> is clicked in facet "<facetName3>"
    Then  related results are displayed
    When  filter number <filter> is clicked in selected filters list
    Then  filter is removed from selected filters list

    Examples:
      | query | filter | facetName    | facetName2 | facetName3  |
      | lego  | 0      | brand_facet  | age_facet  | price_facet |
