Feature: MultiSelect filters component

  Scenario Outline: 1. Number of results and clear-filters button are updated accordingly when selecting multiple filters per facet
    Given no special config for multiselect filters view
    When  "<query>" is searched
    Then  number of results are stored
    When  filter number <filterNumber1> is selected in facet "<facetName>"
    Then  total number of results equals results from the filter <filterNumber1> in "<facetName>"
    And   number of results are less than without filters
    When  filter number <filterNumber2> is selected in facet "<facetName>"
    Then  number of results increases compared with previous stored results
    And   results from the filter <filterNumber2> in "<facetName>" are added to the total number of results
    And   clear-filters button displays the number of selected filters

    Examples:

      | query  | filterNumber1 | filterNumber2 | facetName             |
    #  | muñeca | 0             | 2             | hierarchical_category |
    #  | muñeca | 1             | 2             | rootCategories_facet  |
    #  | muñeca | 2             | 5             | brand_facet           |
    #  | muñeca | 4             | 0             | age_facet             |
      | muñeca | 3             | 1             | price_facet           |
