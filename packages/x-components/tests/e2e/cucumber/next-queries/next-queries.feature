Feature: Next queries component

  Background:
    Given a next queries API with a known response
    Given a results API
    And   a tracking API

  Scenario Outline: 1. Next query is clicked
    Given following config: hide session queries <hideSessionQueries>, requested items <maxItemsToRequest>, loadOnInit <loadOnInit>
    And   start button is clicked
    When  a "<query>" with results is typed
    Then  number of rows requested in "<request>" is <maxItemsToRequest>
    And   at most <maxItemsToRequest> next queries are displayed
    When  next query number <nextQueryItem> is clicked
    Then  the searched query is displayed in the search-box
    And   next queries do not contain the searched query
    Examples:
      | hideSessionQueries | maxItemsToRequest | loadOnInit | query     | nextQueryItem | request |
      | true               | 5                 | true       | playmobil | 0             | interceptedNextQueries |

  Scenario Outline: 2. Next query is not shown if it matches a session history query
    Given following config: hide session queries <hideSessionQueries>, requested items <maxItemsToRequest>, loadOnInit <loadOnInit>
    And   start button is clicked
    When  a "<query>" with results is typed
    Then  number of rows requested in "<request>" is <maxItemsToRequest>
    And   next query number <nextQueryItem> is clicked
    And   the searched query is displayed in history queries
    When  clear search button is pressed
    And   a "<query>" with results is typed
    Then  next queries do not contain the history query is <hideSessionQueries>
    When  clear history queries button is clicked
    Then  next queries contain the history query

    Examples:
      | hideSessionQueries | maxItemsToRequest | loadOnInit | query     | nextQueryItem | request                |
      | true               | 5                 | true       | playmobil | 0             | interceptedNextQueries |
      | false              | 5                 | true       | playmobil | 0             | interceptedNextQueries |

  Scenario Outline: 3. Next queries persistence
    Given following config: hide session queries <hideSessionQueries>, requested items <maxItemsToRequest>, loadOnInit <loadOnInit>
    And   start button is clicked
    When  a "<query>" with results is typed
    Then  number of rows requested in "<request>" is <maxItemsToRequest>
    And   next queries are displayed
    When  the page is reloaded
    Then  next queries are still displayed is <loadOnInit>
    When  a "<query>" with results is typed
    Then  number of rows requested in "<request>" is <maxItemsToRequest>
    And   next queries are displayed
    When  clear search button is pressed
    Then  next queries are still displayed

    Examples:
      | hideSessionQueries | maxItemsToRequest | loadOnInit | query     | request                |
      | true               | 5                 | true       | playmobil | interceptedNextQueries |
      | true               | 5                 | false      | playmobil | interceptedNextQueries |

