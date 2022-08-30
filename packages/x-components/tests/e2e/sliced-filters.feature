Feature: Sliced Filters components

  Background:
    Given a next queries API
    And   a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a tracking API
    And   a recommendations API with a known response
    And   a results API with a known response

  Scenario Outline: 1. Filters received in a facet are more than slicedFiltersMax
    Given following config: max of sliced filters <slicedFiltersMax>
    And   start button is clicked
    When  "<query>" is searched
    And   filters are displayed
    Then  number of sliced filters in facet "<facetName>" are stored
    And   number of sliced filters match <slicedFiltersMax>
    And   number of hidden filters in facet "<facetName>" are stored
    And   total filters per facet are calculated
    When  clicking in show more button "<facetName>"
    Then  number of sliced filters in facet "<facetName>" are stored
    And   total filters match displayed + hidden filters

    Examples:
      | slicedFiltersMax | query  | facetName |
      | 2                | lego   | age_facet |

  Scenario Outline: 2. Filters received in a facet are less than slicedFiltersMax
    Given following config: max of sliced filters <slicedFiltersMax>
    And   start button is clicked
    When  "<query>" is searched
    And   filters are displayed
    Then  number of sliced filters in facet "<facetName>" are stored
    And   number of sliced filters are at most <slicedFiltersMax>
    And   no show more / show less buttons are displayed in "<facetName>"

    Examples:
      | slicedFiltersMax | query  | facetName |
      | 10               | lego   | age_facet |

  Scenario Outline: 3. Hidden filter is selected
    Given following config: max of sliced filters <slicedFiltersMax>
    And   start button is clicked
    When  "<query>" is searched
    And   filters are displayed
    When  clicking in show more button "<facetName>"
    And   filter number <lastFilter> is clicked in facet "<facetName>"
    And   filter number <lastFilter> is clicked in facet "<facetName>"
    And   filter number <lastFilter> is clicked in facet "<facetName>"
    When  clicking in show less button "<facetName>"
    Then  number of selected filters in facet "<facetName>" are 3
    When  clicking in show more button "<facetName>"
    Then  number of selected filters in facet "<facetName>" are 3

    Examples:
      | slicedFiltersMax | query  | lastFilter | facetName   |
      | 2                | lego   | 5          | price_facet |
