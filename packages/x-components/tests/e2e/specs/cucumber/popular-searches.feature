Feature: Popular searches component

  Scenario Outline:  1. Popular searches are load together with the page
    Given following config: hide session queries <hideSessionQueries>, requested items <maxItemsToRequest>, rendered <maxItemsToRender>
    Then  number of popular searches displayed is equal or less than <maxItemsToRender>
    Examples:
      | hideSessionQueries | maxItemsToRequest | maxItemsToRender |
      | true               | 10                | 20               |
      | true               | 10                | 5                |
      | false              | 20                | 10               |
      | false              | 5                 | 10               |

  Scenario Outline: 2. Popular search is clicked
    Given following config: hide session queries <hideSessionQueries>, requested items <maxItemsToRequest>, rendered <maxItemsToRender>
    When  popular search number <popularSearchItem> is clicked
    Then  the clicked popular search term is displayed in the search-box
    And   the clicked popular search is removed from Popular Searches if <hideSessionQueries> is true
    And   no new term is displayed in Popular Searches if hideSessionQueries = <hideSessionQueries> is true and maxItemsToRender = <maxItemsToRender> > maxItemsToRequest = <maxItemsToRequest>
    And   related results are displayed
    And   query suggestions are displayed
    And   next queries are displayed
    And   related tags are displayed
    And   popular search is displayed in history queries
    Examples:
      | hideSessionQueries | maxItemsToRequest | maxItemsToRender | popularSearchItem |
      | true               | 10                | 5                | 0                 |
      | true               | 5                 | 10               | 1                 |
      | false              | 10                | 5                | 3                 |

