Feature: Query-suggestions component

  Background:
    Given a results API with a known response
    And a query suggestions API with a known response
    And   a tracking API

  Scenario Outline: 1. Query suggestions are displayed while typing a query
    Given following config: hide if equals query <hideIfEqualsQuery>, requested items <maxItemsToRequest>
    And   start button is clicked
    Then  empathize should be visible
    And   no query suggestions are displayed
    When  a "<syllable>" with results is typed
    Then  at most <maxItemsToRequest> query suggestions are displayed
    And   all query suggestions contain the searched query
    When  a "<secondSyllable>" with results is typed
    Then  all query suggestions contain the searched query
    And   at most <maxItemsToRequest> query suggestions are displayed
    When  a query suggestions API with no query suggestions
    And   clear search button is pressed
    Then  no query suggestions are displayed

    Examples:
      | hideIfEqualsQuery | maxItemsToRequest | syllable  | secondSyllable  |
      | false             | 6                 | le        | go              |
      | true              | 6                 | le        | go              |

  Scenario Outline: 2. Query suggestion is clicked
    Given following config: hide if equals query <hideIfEqualsQuery>, requested items <maxItemsToRequest>
    And   start button is clicked
    Then  empathize should be visible
    And   a "<query>" with results is typed
    And   at most <maxItemsToRequest> query suggestions are displayed
    And   all query suggestions contain the searched query
    When  query suggestion number <querySuggestionItem> is clicked
    And   the searched query is displayed in the search-box
    And   related results are displayed
    Then  all query suggestions contain the searched query
    When  clear search button is pressed
    Then  the searched query is displayed in history queries

    Examples:
      | hideIfEqualsQuery | maxItemsToRequest | query   | querySuggestionItem |
      | true              | 6                 | le      | 0                   |

  Scenario Outline: 3. hideIfEqualsQuery behavior
    Given following config: hide if equals query <hideIfEqualsQuery>, requested items <maxItemsToRequest>
    And   start button is clicked
    Then  empathize should be visible
    When  a "<query>" with results is typed
    Then  "<query>" term is not included as first query suggestion is <hideIfEqualsQuery>

    Examples:
      | hideIfEqualsQuery | maxItemsToRequest | query   |
      | false             | 5                 | lego    |
      | true              | 5                 | lego    |
