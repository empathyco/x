Feature: Simple filters

  Background:
    Given a next queries API
    And   a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a tracking API
    And   a recommendations API with a known response
    And   a results API with a known response
    And   no special config for layout view
    And   start button is clicked

  Scenario Outline: 1. Only one filter from same facet can be selected at the same time
    When  "<query>" is searched
    Then  related results are displayed
    When  waiting for search request intercept
    And   filter number <simpleFilter1> is clicked in facet "<facetName>"
    Then  selection status of filter number <simpleFilter1> in facet "<facetName>" is true
    And   filter number <simpleFilter1> is shown in the selected filters list is true
    And   search request contains selected filter number <simpleFilter1> is true
    When  waiting for search request intercept
    And   filter number <simpleFilter2> is clicked in facet "<facetName>"
    Then  related results are displayed
    And   selection status of filter number <simpleFilter1> in facet "<facetName>" is false
    And   filter number <simpleFilter1> is shown in the selected filters list is false
    And   search request contains selected filter number <simpleFilter1> is false
    And   selection status of filter number <simpleFilter2> in facet "<facetName>" is true
    And   filter number <simpleFilter2> is shown in the selected filters list is true
    And   search request contains selected filter number <simpleFilter2> is true

    Examples:
      | query | simpleFilter1 | simpleFilter2 | facetName   |
      | lego  | 0             | 2             | age_facet   |

  Scenario Outline: 2. Parent and children from same facet can be selected at the same time
    When  "<query>" is searched
    And   filter number <hierarchicalFilter1> is clicked in facet "<facetName>"
    Then  related results are displayed
    And   selection status of filter number <hierarchicalFilter1> in facet "<facetName>" is true
    When  child hierarchical filter <childFilter1> from parent filter <hierarchicalFilter1> in "<facetName>" is clicked
    Then  related results are displayed
    And   selection status of child filter number <childFilter1> in facet "<facetName>" is true
    And   selection status of filter number <hierarchicalFilter1> in facet "<facetName>" is true
    When  child hierarchical filter <childFilter1> from parent filter <hierarchicalFilter1> in "<facetName>" is clicked
    Then  related results are displayed
    And   selection status of child filter number <childFilter1> in facet "<facetName>" is false
    And   selection status of filter number <hierarchicalFilter1> in facet "<facetName>" is true
    When  child hierarchical filter <childFilter1> from parent filter <hierarchicalFilter1> in "<facetName>" is clicked
    And   filter number <hierarchicalFilter1> is clicked in facet "<facetName>"
    Then  selection status of child filter number <childFilter1> in facet "<facetName>" is false
    And   selection status of filter number <hierarchicalFilter1> in facet "<facetName>" is false
    When  child hierarchical filter <childFilter1> from parent filter <hierarchicalFilter1> in "<facetName>" is clicked
    Then  selection status of child filter number <childFilter1> in facet "<facetName>" is true
    And   selection status of filter number <hierarchicalFilter1> in facet "<facetName>" is true
    When  filter number <hierarchicalFilter2> is clicked in facet "<facetName>"
    Then  selection status of child filter number <childFilter1> in facet "<facetName>" is false
    And   selection status of filter number <hierarchicalFilter1> in facet "<facetName>" is false

    Examples:
      | query | hierarchicalFilter1 | hierarchicalFilter2 | childFilter1 | facetName             |
      | lego  | 0                   | 2                   | 0            | hierarchical_category |




