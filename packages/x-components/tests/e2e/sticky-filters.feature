Feature: Sticky filters

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

  Scenario Outline: 1. Sticky filter is mantained after clearing the query
    When "<query>" is searched
    Then related results are displayed
    And   filter number <filter1> is clicked in facet "<stickyFacetName>"
    Then  selection status of filter number <filter1> in facet "<stickyFacetName>" is true
    And   filter number <filter1> is clicked in facet "<facetName>"
    Then  selection status of filter number <filter1> in facet "<facetName>" is true
    When clear search button is pressed
    Then "<query2>" is searched
    Then  related results are displayed
    Then  selection status of filter number <filter1> in facet "<stickyFacetName>" is true
    And  selection status of filter number <filter1> in facet "<facetName>" is false

    Examples:
      | query | query2 | filter1 | stickyFacetName    | facetName |
      | lego  | test   | 0       | price_facet | age_facet |

  Scenario Outline: 2. Sticky filter is mantained after changing the query
    When "<query>" is searched
    Then related results are displayed
    And   filter number <filter1> is clicked in facet "<stickyFacetName>"
    Then  selection status of filter number <filter1> in facet "<stickyFacetName>" is true
    And   filter number <filter1> is clicked in facet "<facetName>"
    Then  selection status of filter number <filter1> in facet "<facetName>" is true
    Then "<query2>" replaces current query
    Then  related results are displayed
    Then  selection status of filter number <filter1> in facet "<stickyFacetName>" is true
    And  selection status of filter number <filter1> in facet "<facetName>" is false

    Examples:
      | query | query2 | filter1 | stickyFacetName | facetName |
      | lego  | test   | 0       | price_facet     | age_facet |

  Scenario Outline: 3. Sticky filter is cleared on click
    When "<query>" is searched
    Then related results are displayed
    And   filter number <filter> is clicked in facet "<facetName>"
    Then  selection status of filter number <filter> in facet "<facetName>" is true
    And   filter number <filter> is clicked in facet "<facetName>"
    Then  selection status of filter number <filter> in facet "<facetName>" is false

    Examples:
      | query |  filter | facetName |
      | lego  |  0       | age_facet |

