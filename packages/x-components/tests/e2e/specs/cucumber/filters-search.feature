Feature: Filters search component

  Scenario Outline: 1. Brand filters are updated based on regular and sifted queries
    Given no special config for base-filters-search view
    When  "<query>" is searched
    Then  brand filters for the searched query are displayed
    And   searchable brand filters are stored
    When  "<siftedQuery>" is typed in the filters search input
    Then  brand filters are refined with sifted search, "<siftedQuery>"
    And   searchable brand filters contain refined brand filters
    Examples:
      | query | siftedQuery |
      | juego | as          |


