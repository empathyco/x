Feature: MultiSelect filters component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a tracking API
    And   no special config for layout view
    And   start button is clicked

  Scenario Outline: 1. Testing multi-select filters
    When  "<query>" is searched
    Then  related results are displayed
    When  waiting for search request intercept
    And   filter number <multiselectFilter1> is clicked in facet "<facetName>"
    Then  selection status of filter number <multiselectFilter1> in facet "<facetName>" is true
    And   search request contains selected filter number <multiselectFilter1> is true
    When  waiting for search request intercept
    And   filter number <multiselectFilter2> is clicked in facet "<facetName>"
    Then  related results are displayed
    And   selection status of filter number <multiselectFilter1> in facet "<facetName>" is true
    And   selection status of filter number <multiselectFilter2> in facet "<facetName>" is true
    And   search request contains selected filter number <multiselectFilter1> is true
    And   search request contains selected filter number <multiselectFilter2> is true
    When  waiting for search request intercept
    And   selected filter number <selectedFilter> in facet "<facetName>" list is clicked
    Then  related results are displayed
    And   selection status of filter number <multiselectFilter1> in facet "<facetName>" is false
    And   selection status of filter number <multiselectFilter2> in facet "<facetName>" is true
    And   search request contains selected filter number <multiselectFilter1> is false
    And   search request contains selected filter number <multiselectFilter2> is true
    When  waiting for search request intercept
    And   selected filter number <selectedFilter> in facet "<facetName>" list is clicked
    Then  related results are displayed
    And   selection status of filter number <multiselectFilter1> in facet "<facetName>" is false
    And   selection status of filter number <multiselectFilter2> in facet "<facetName>" is false
    And   search request contains selected filter number <multiselectFilter1> is false
    And   search request contains selected filter number <multiselectFilter2> is false

    Examples:
      | query  | multiselectFilter1 | multiselectFilter2 | facetName    | selectedFilter |
      | lego   | 3                  | 1                  | price_facet  | 0              |
