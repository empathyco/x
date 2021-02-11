Feature: History queries component

  Scenario Outline:  1. History query is clicked
    Given following config: hide if equals query <hideIfEqualsQuery>, debounce <debounceInMs>, requested items <maxItemsToStore>, rendered <maxItemsToRender>, instant search <instant>
    And   a "<list>" of queries already searched
    When  history query number <historyQueryItem> is clicked
    Then  the searched query is displayed in the search-box
    And   the clicked history query is not displayed in history queries if <hideIfEqualsQuery> is true
    And   the query is displayed in history queries
    And   related results are displayed
    And   query suggestions are displayed
    And   next queries are displayed
    And   related tags are displayed
    Examples:
      | hideIfEqualsQuery | debounceInMs | maxItemsToStore | maxItemsToRender | instant  | historyQueryItem | list                                                                                                           |
      | true              | 150          | 15              | 8                | true     | 7                | puzzle, funko, puzzle 3d, funko pop, puzzle 3d harry, funko pop iron, puzzle 3d harry potter, funko pop iron man |
      | false             | 150          | 15              | 8                | true     | 6                | puzzle, funko, puzzle 3d, funko pop, puzzle 3d harry, funko pop iron, puzzle 3d harry potter, funko pop iron man |

  Scenario Outline: 2. History query delete button is clicked
    Given following config: hide if equals query <hideIfEqualsQuery>, debounce <debounceInMs>, requested items <maxItemsToStore>, rendered <maxItemsToRender>, instant search <instant>
    And   a "<list>" of queries already searched
    When  the delete button of <historyQueryItem> is clicked
    Then  the deleted history query is removed from history queries
    And   the number of rendered history queries is <maxItemsToRender> - 1 if <maxItemsToStore> < <maxItemsToRender>
    Examples:
      | hideIfEqualsQuery | debounceInMs | maxItemsToStore | maxItemsToRender | instant  | historyQueryItem | list                                                                                                             |
      | true              | 150          | 15              | 5                | true     | 0                | puzzle, funko, puzzle 3d, funko pop, puzzle 3d harry, funko pop iron, puzzle 3d harry potter, funko pop iron man |
      | false             | 150          | 5               | 8                | true     | 4                | puzzle, funko, puzzle 3d, funko pop, puzzle 3d harry, funko pop iron, puzzle 3d harry potter, funko pop iron man |

  Scenario Outline: 3. Clear history queries button is clicked
    Given following config: hide if equals query <hideIfEqualsQuery>, debounce <debounceInMs>, requested items <maxItemsToStore>, rendered <maxItemsToRender>, instant search <instant>
    And   a "<list>" of queries already searched
    When  clear history queries button is clicked
    Then  no history queries are displayed
    And   clear history queries button is disabled

    Examples:
      | hideIfEqualsQuery | debounceInMs | maxItemsToStore | maxItemsToRender | instant  | list                                                 |
      | true              | 150          | 15              | 5                | true     | puzzle, funko, puzzle 3d, funko pop, puzzle 3d harry |

  Scenario Outline: 4. Query containing a history query is typed
    Given following config: hide if equals query <hideIfEqualsQuery>, debounce <debounceInMs>, requested items <maxItemsToStore>, rendered <maxItemsToRender>, instant search <instant>
    And   no history queries are displayed
    When  "<query>" is searched
    And   related results are displayed
    And   "<followingQuery>" is searched
    And   the searched query is displayed in the search-box
    And   clear search button is clicked
    Then  "<query>" is deleted from history queries, whereas "<followingQuery>" remains

    Examples:
      | hideIfEqualsQuery | debounceInMs | maxItemsToStore | maxItemsToRender | instant  | query | followingQuery |
      | true              | 150          | 15              | 5                | true     | le    | go             |
  #   | true              | 150          | 15              | 5                | true     | le    | go star wars   |

  Scenario Outline: 5. History query is not stored if instant search is false
    Given following config: hide if equals query <hideIfEqualsQuery>, debounce <debounceInMs>, requested items <maxItemsToStore>, rendered <maxItemsToRender>, instant search <instant>
    When  a "<query>" with results is typed
    Then  no history queries are displayed after <debounceInMs> ms if <instant> is false
    Examples:
      | hideIfEqualsQuery | debounceInMs  | maxItemsToStore | maxItemsToRender | instant | query  |
      | true              | 1000          | 15              | 5                | true    | barbie |
      | true              | 1000          | 15              | 5                | false   | barbie |

    Scenario Outline: 6. Number and order of rendered history queries
      Given following config: hide if equals query <hideIfEqualsQuery>, debounce <debounceInMs>, requested items <maxItemsToStore>, rendered <maxItemsToRender>, instant search <instant>
      And   a "<list>" of queries already searched
      When  history query number <historyQueryItem> is clicked
      And   clear search button is clicked
      Then  the searched query is removed from <historyQueryItem> position in history queries
      And   the searched query is the first item in history queries
      And   displayed history queries are min of number of queries already searched, max requested items <maxItemsToStore>, max rendered items <maxItemsToRender>

      Examples:
        | hideIfEqualsQuery | debounceInMs | maxItemsToStore | maxItemsToRender | instant  | historyQueryItem  | list                                                      |
        | false             | 150          | 4               | 6                | true     | 1                 | puzzle, funko, lego, coche, barbie, casa, muñeca, peluche |
        | false             | 150          | 6               | 8                | true     | 2                 | puzzle, funko, lego, coche                                |
        | false             | 150          | 8               | 4                | true     | 3                 | puzzle, funko, lego, coche, barbie, casa                  |
