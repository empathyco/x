Feature: History queries component

  Background:
    Given a results API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API
    And   a tracking API

  Scenario Outline:  1. History query is clicked
    Given following config: hide if equals query <hideIfEqualsQuery>, debounce <debounceInMs>, requested items <maxItemsToStore>, rendered <maxItemsToRender>, instant search <instant>
    And   start button is clicked
    And   a "<list>" of queries already searched
    When  search-input is focused
    And   history query number <historyQueryItem> is clicked
    And   search-input is focused
    Then  the searched query is displayed in the search-box
    And   the searched query is not displayed in history queries if <hideIfEqualsQuery> is true


  Scenario Outline: 2. History query delete button is clicked
    Given following config: hide if equals query <hideIfEqualsQuery>, debounce <debounceInMs>, requested items <maxItemsToStore>, rendered <maxItemsToRender>, instant search <instant>
    And   start button is clicked
    And   a "<list>" of queries already searched
    When  search-input is focused
    And   the delete button of <historyQueryItem> is clicked
    Then  the deleted history query is removed from history queries
    And   the number of rendered history queries is <maxItemsToRender> - 1 if <maxItemsToStore> < <maxItemsToRender>


  Scenario Outline: 3. Clear history queries button is clicked
    Given following config: hide if equals query <hideIfEqualsQuery>, debounce <debounceInMs>, requested items <maxItemsToStore>, rendered <maxItemsToRender>, instant search <instant>
    And   start button is clicked
    And   a "<list>" of queries already searched
    When  search-input is focused
    And   clear history queries button is clicked
    Then  no history queries are displayed
    And   clear history queries button is disabled

  Scenario Outline: 4. Query containing a history query is typed
    Given following config: hide if equals query <hideIfEqualsQuery>, debounce <debounceInMs>, requested items <maxItemsToStore>, rendered <maxItemsToRender>, instant search <instant>
    And   start button is clicked
    And   no history queries are displayed
    When  "<query>" is searched
    And   "<followingQuery>" is searched
    Then   the searched query is displayed in the search-box
    When   clear search button is pressed
    Then  "<query>" is deleted from history queries, whereas "<followingQuery>" remains


  Scenario Outline: 5. History query is not stored if instant search is false
    Given a results API with a known response
    Given following config: hide if equals query <hideIfEqualsQuery>, debounce <debounceInMs>, requested items <maxItemsToStore>, rendered <maxItemsToRender>, instant search <instant>
    And   start button is clicked
    When  a "<query>" with results is typed
    Then  no history queries are displayed after <debounceInMs> ms if <instant> is false

  Scenario Outline: 6. Number and order of rendered history queries
    Given following config: hide if equals query <hideIfEqualsQuery>, debounce <debounceInMs>, requested items <maxItemsToStore>, rendered <maxItemsToRender>, instant search <instant>
    And   start button is clicked
    And   a "<list>" of queries already searched
    When  search-input is focused
    And   history query number <historyQueryItem> is clicked
    Then  related results are displayed
    When  clear search button is pressed
    Then  the searched query is removed from <historyQueryItem> position in history queries
    And   the searched query is the first item in history queries
    And   displayed history queries are min of number of queries already searched, max requested items <maxItemsToStore>, max rendered items <maxItemsToRender>

    Examples:
      | hideIfEqualsQuery | debounceInMs | maxItemsToStore | maxItemsToRender | instant | historyQueryItem | list                                                      |
      | false             | 150          | 4               | 6                | true    | 1                | puzzle, funko, lego, coche, barbie, casa, muñeca, peluche |
      | false             | 150          | 6               | 8                | true    | 2                | puzzle, funko, lego, coche                                |
      | false             | 150          | 8               | 4                | true    | 3                | puzzle, funko, lego, coche, barbie, casa                  |
