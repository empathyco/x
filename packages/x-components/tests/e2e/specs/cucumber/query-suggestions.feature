Feature: Query-suggestions component

  Scenario Outline: 1. Query suggestions are displayed while typing a query
    Given following config: hide if equals query <hideIfEqualsQuery>, requested items <maxItemsToRequest>
    And   no query suggestion are displayed
    When  a "<syllable>" with results is typed
    Then  at most <maxItemsToRequest> query suggestions are displayed
    And   all query suggestions contain the searched query
    When  a "<secondSyllable>" with results is typed
    Then  all query suggestions contain the searched query
    And   at most <maxItemsToRequest> query suggestions are displayed
    When  clear search button is pressed
    And   a "<newQuery>" with results is typed
    Then  at most <maxItemsToRequest> query suggestions are displayed
    And   all query suggestions contain the searched query

    Examples:
      | hideIfEqualsQuery | maxItemsToRequest | syllable  | secondSyllable  | newQuery  |
      | true              | 5                 | ma        | rio             | peluche   |
      | false             | 10                | bar       | bie             | peluche   |
      | false             | 15                | le        | go              | peluche   |

  Scenario Outline: 2. Query suggestion is clicked
    Given following config: hide if equals query <hideIfEqualsQuery>, requested items <maxItemsToRequest>
    And   a "<query>" with results is typed
    And   at most <maxItemsToRequest> query suggestions are displayed
    And   all query suggestions contain the searched query
    When  query suggestion number <querySuggestionItem> is clicked
    And   the searched query is displayed in the search-box
    Then  all query suggestions contain the searched query
    And   related results are displayed
    And   the searched query is displayed in history queries

    Examples:
      | hideIfEqualsQuery | maxItemsToRequest | query   | querySuggestionItem |
      | true              | 2                 | ani     | 0                   |
      | false             | 3                 | funko   | 2                   |
      | false             | 5                 | lego    | 4                   |

  Scenario Outline: 3. hideIfEqualsQuery behavior
    Given following config: hide if equals query <hideIfEqualsQuery>, requested items <maxItemsToRequest>
    When  a "<query>" with results is typed
    Then  "<query>" term is not included as first query suggestion is <hideIfEqualsQuery>

    Examples:
      | hideIfEqualsQuery | maxItemsToRequest | query   |
      | false             | 5                 | puzzle  |
      | true              | 5                 | nenuco  |
