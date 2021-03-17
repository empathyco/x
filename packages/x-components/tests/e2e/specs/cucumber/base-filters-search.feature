Feature: Base filters search component

  Scenario Outline: 1. Brand filters are updated based on regular and sifted queries
    Given no special config for base-filters-search view
    When  "<query>" is searched
    Then  brand filters for the searched query are displayed
    When  "<siftedQuery>" is typed in the filters search input
    Then  brand filters are refined with sifted search, "<siftedQuery>"
    Examples:
      | query | siftedQuery |
      | lego  | ci          |

