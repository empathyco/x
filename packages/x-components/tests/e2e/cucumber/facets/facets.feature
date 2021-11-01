Feature: Search in filters

  Background:
    Given a next queries API
    And   a suggestions API
    And   a related tags API
    And   a recommendations API with a known response
    And   a results API with a known response
    And   no special config for layout view
    And   start button is clicked

  Scenario Outline: 1. Testing simple filters
    When  "<query>" is searched
    Then  related results are displayed
    When  waiting for search request intercept
    And   filter number <simpleFilter1> is clicked in facet "<facetName>"
    Then  clicked filter <simpleFilter1> is selected in facet "<facetName>" is true
    And   clicked filter number <simpleFilter1> is shown in the selected filters list is true
    And   search request contains selected filter number <simpleFilter1> is true
    When  waiting for search request intercept
    And   filter number <simpleFilter2> is clicked in facet "<facetName>"
    Then  related results are displayed
    And   clicked filter <simpleFilter1> is selected in facet "<facetName>" is false
    And   clicked filter number <simpleFilter1> is shown in the selected filters list is false
    And   search request contains selected filter number <simpleFilter1> is false
    And   clicked filter <simpleFilter2> is selected in facet "<facetName>" is true
    And   clicked filter number <simpleFilter2> is shown in the selected filters list is true
    And   search request contains selected filter number <simpleFilter2> is true

    Examples:
      | query | simpleFilter1 | simpleFilter2 | facetName   |
      | lego  | 0             | 2             | age_facet   |

  Scenario Outline: 2. Testing hierarchical filters
    When  "<query>" is searched
    And   filter number <hierarchicalFilter1> is clicked in facet "<facetName>"
    Then  related results are displayed
    And   clicked filter <hierarchicalFilter1> is selected in facet "<facetName>" is true
    When  child hierarchical filter <childFilter1> from parent filter <hierarchicalFilter1> in "<facetName>" is clicked
    Then  related results are displayed
    And   clicked child filter <childFilter1> is selected in facet "<facetName>" is true
    And   clicked filter <hierarchicalFilter1> is selected in facet "<facetName>" is true
    When  child hierarchical filter <childFilter1> from parent filter <hierarchicalFilter1> in "<facetName>" is clicked
    Then  related results are displayed
    And   clicked child filter <childFilter1> is selected in facet "<facetName>" is false
    And   clicked filter <hierarchicalFilter1> is selected in facet "<facetName>" is true
    When  child hierarchical filter <childFilter1> from parent filter <hierarchicalFilter1> in "<facetName>" is clicked
    And   filter number <hierarchicalFilter1> is clicked in facet "<facetName>"
    Then  clicked child filter <childFilter1> is selected in facet "<facetName>" is false
    And   clicked filter <hierarchicalFilter1> is selected in facet "<facetName>" is false
    Examples:
      | query | hierarchicalFilter1 | childFilter1 | facetName             |
      | lego  | 0                   | 0            | hierarchical_category |

  Scenario Outline: 3. Clearing filters
    When  "<query>" is searched
    And   filter number <filter> is clicked in facet "<facetName>"
    And   filter number <filter> is clicked in facet "<facetName2>"
    And   filter number <filter> is clicked in facet "<facetName3>"
    Then  related results are displayed
    When  clear filters button is clicked
    Then  no filters are selected
    Examples:
      | query | filter | facetName    | facetName2 | facetName3  |
      | lego  | 0      | brand_facet  | age_facet  | price_facet |



