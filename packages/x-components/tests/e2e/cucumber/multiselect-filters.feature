Feature: MultiSelect filters component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API
    And   no special config for layout view
    And   start button is clicked

  Scenario Outline: 1. Testing multi-select filters
    When  "<query>" is searched
    And   waiting for search request intercept
    And   filter number <multiselectFilter1> is clicked in facet "<facetName>"
    Then  related results are displayed
    And   clicked filter <multiselectFilter1> is selected in facet "<facetName>" is true
    And   search request contains selected filter number <multiselectFilter1> is true
    When  waiting for search request intercept
    And   filter number <multiselectFilter2> is clicked in facet "<facetName>"
    Then  related results are displayed
    # TODO  https://searchbroker.atlassian.net/browse/EX-4866
    # And   clicked filter <multiselectFilter1> is selected in facet "<facetName>" is true
    # And   clicked filter <multiselectFilter2> is selected in facet "<facetName>" is true
    # And   search request contains selected filter number <multiselectFilter1> is true
    # And   search request contains selected filter number <multiselectFilter2> is true
    When  waiting for search request intercept
    And   filter number <multiselectFilter2> is clicked in facet "<facetName>"
    Then  related results are displayed
    # TODO  https://searchbroker.atlassian.net/browse/EX-4866
    # And   clicked filter <multiselectFilter1> is selected in facet "<facetName>" is true
    # And   clicked filter <multiselectFilter2> is selected in facet "<facetName>" is false
    # And   search request contains selected filter number <multiselectFilter1> is true
    # And   search request contains selected filter number <multiselectFilter2> is false
    When  waiting for search request intercept
    And   filter number <multiselectFilter1> is clicked in facet "<facetName>"
    Then  related results are displayed
    # TODO  https://searchbroker.atlassian.net/browse/EX-4866
    # And   clicked filter <multiselectFilter1> is selected in facet "<facetName>" is false
    # And   clicked filter <multiselectFilter2> is selected in facet "<facetName>" is false
    # And   search request contains selected filter number <multiselectFilter1> is false
    # And   search request contains selected filter number <multiselectFilter2> is false
    Examples:
      | query  | multiselectFilter1 | multiselectFilter2 | facetName    |
      | lego   | 3                  | 1                  | price_facet  |

