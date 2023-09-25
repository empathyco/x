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

  Scenario Outline: 1. Sticky filter is kept after clearing the query
    When "<query>" is searched
    Then related results are displayed
    When   filter number <filterIndex> is clicked in facet "<stickyFacetName>"
    Then  filter number <filterIndex> in facet "<stickyFacetName>" is selected
    When   filter number <filterIndex> is clicked in facet "<facetName>"
    Then  filter number <filterIndex> in facet "<facetName>" is selected
    When clear search button is pressed
    Then "<query2>" is searched
    And  related results are displayed
    And  filter number <filterIndex> in facet "<stickyFacetName>" is selected
    And  filter number <filterIndex> in facet "<facetName>" is not selected

    Examples:
      | query | query2 | filterIndex | stickyFacetName | facetName |
      | lego  | test   | 0           | brand_facet     | age_facet |

  Scenario Outline: 2. Sticky filter is kept after changing the query
    When "<query>" is searched
    Then related results are displayed
    When   filter number <filterIndex> is clicked in facet "<stickyFacetName>"
    Then  filter number <filterIndex> in facet "<stickyFacetName>" is selected
    When   filter number <filterIndex> is clicked in facet "<facetName>"
    Then  filter number <filterIndex> in facet "<facetName>" is selected
    When "<query2>" replaces current query
    Then  related results are displayed
    Then  filter number <filterIndex> in facet "<stickyFacetName>" is selected
    Then  filter number <filterIndex> in facet "<facetName>" is not selected

    Examples:
      | query | query2 | filterIndex | stickyFacetName | facetName |
      | lego  | test   | 0           | brand_facet     | age_facet |

  Scenario Outline: 3. Sticky filter is cleared on click
    When "<query>" is searched
    Then related results are displayed
    When   filter number <filterIndex> is clicked in facet "<facetName>"
    Then  filter number <filterIndex> in facet "<facetName>" is selected
    When   filter number <filterIndex> is clicked in facet "<facetName>"
    Then  filter number <filterIndex> in facet "<facetName>" is not selected

    Examples:
      | query | filterIndex | facetName   |
      | lego  | 0           | brand_facet |

