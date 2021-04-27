Feature: Sliced Filters components

  Scenario Outline: 1. Total filters match displayed + hidden filters
    Given following config: max of sliced filters <slicedFiltersMax>
    When  "<query>" is searched
    And   filters are displayed
    And   number of total filters per facet are stored
    And   number of sliced filters per facet are stored
    Then  hidden filters per facet are calculated
    Then  total filters - hidden filters per facet is displayed in show more button
    Examples:
      | slicedFiltersMax | query  |
      | 2                | muñeca |
      | 10               | lego   |


  Scenario Outline: 2. Show more / less button displays or hide part of the results
    Given following config: max of sliced filters <slicedFiltersMax>
    When  "<query>" is searched
    And   filters are displayed
    And   show more buttons are clicked
    And   number of total filters per facet are stored
    And   number of sliced filters per facet are stored
    Then  numbers of sliced and total filters per facet match
    When  show less buttons are clicked
    And   number of sliced filters per facet are stored
    And   show less button hides all filters above number <slicedFiltersMax>
    Examples:
      | slicedFiltersMax | query  |
      | 2                | muñeca |
      | 10               | lego   |
