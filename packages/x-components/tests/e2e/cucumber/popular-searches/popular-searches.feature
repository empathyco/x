Feature: Popular searches component

  Background:
    Given a popular searches API with a known response
    And   a results API
    And   a next queries API
    And   a recommendations API with a known response
    And   a related tags API

  Scenario Outline:  1. Popular searches are load together with the page
    Given following config: hide session queries <hideSessionQueries>, requested items <maxItemsToRequest>, rendered <maxItemsToRender>
    And   start button is clicked
    Then  number of rows requested in "<request>" is <maxItemsToRequest>
    And   at most <maxItemsToRender> popular searched are displayed
    Examples:
      | hideSessionQueries | maxItemsToRequest | maxItemsToRender | request                    |
      | true               | 10                | 20               | interceptedPopularSearches |
      | true               | 10                | 5                | interceptedPopularSearches |
      | false              | 20                | 10               | interceptedPopularSearches |
      | false              | 5                 | 10               | interceptedPopularSearches |

  Scenario Outline: 2. Popular search is clicked
    Given following config: hide session queries <hideSessionQueries>, requested items <maxItemsToRequest>, rendered <maxItemsToRender>
    And   start button is clicked
    Then  number of rows requested in "<request>" is <maxItemsToRequest>
    When  popular search number <popularSearchItem> is clicked
    Then  the searched query is displayed in the search-box
    When  search-input is focused
    Then  the clicked popular search is removed from Popular Searches if <hideSessionQueries> is true
    And   no new term is displayed in Popular Searches if hideSessionQueries = <hideSessionQueries> is true and maxItemsToRender = <maxItemsToRender> > maxItemsToRequest = <maxItemsToRequest>
    And   the searched query is displayed in history queries

    Examples:
      | hideSessionQueries | maxItemsToRequest | maxItemsToRender | popularSearchItem | request                    |
      | false              | 10                | 5                | 0                 | interceptedPopularSearches |
      | true               | 5                 | 10               | 4                 | interceptedPopularSearches |

