Feature: Full Empathize

  Scenario Outline: 1. Query suggestions
    Given no special config for full empathize view
    When  a "<query>" with results is typed
    # change maxItemsToRequest to maxItemsToRender once [EX-3992] is done
    Then  at most <maxItemsToRequest> query suggestions are displayed
    When  query suggestion number <querySuggestionItem> is clicked
    And   the searched query is displayed in the search-box
    When  clear search button is pressed
    And   search-input is focused
    Then  no query suggestion are displayed

    Examples:
      | query | maxItemsToRequest | querySuggestionItem |
      | lego  | 9                 | 1                   |

  Scenario Outline: 2. History queries
    Given no special config for full empathize view
    And   a "<list>" of queries already searched
    And   search-input is focused
    And   clear search button is pressed
    And   search-input is focused
    Then  history queries are displayed
    When  history query number <historyQueryItem> is clicked
    Then  the searched query is displayed in the search-box
    When  clear search button is pressed
    # next line to be removed once [EX-2242] is done
    And   search-input is focused
    And   the delete button of <historyQueryItem2> is clicked
    Then  the deleted history query is removed from history queries

    Examples:
      | list                        | historyQueryItem  | historyQueryItem2 |
      | barbie, lego, puzzle, funko | 1                 | 0                 |

  Scenario Outline: 3. Popular searches
    Given no special config for full empathize view
    When  popular search number <popularSearchItem> is clicked
    Then  the searched query is displayed in the search-box

    Examples:
      | popularSearchItem |
      | 0                 |

  Scenario Outline: 4. Next queries
    Given no special config for full empathize view
    When  a "<query>" with results is typed
    And   next queries are displayed
    When  next query number <nextQueryItem> is clicked
    Then  the searched query is displayed in the search-box

    Examples:
      | query  | nextQueryItem |
      | barbie | 0             |

  Scenario Outline: 5. Related tags
    Given no special config for full empathize view
    When  a "<query>" with results is typed
    And   related tags are displayed
    When  related tag number <relatedTagItem> is clicked
    Then  clicked related tag is shown in position 0 as selected
    Examples:
      | query  | relatedTagItem |
      | barbie | 2              |

  Scenario Outline: 6. Recommendations
    Given following config: max recommendations to request <maxItemsToRequest>
    Then  number of displayed recommendations are equal or less than <maxItemsToRequest>

    Examples:
      | maxItemsToRequest |
      | 5                 |

  Scenario Outline: 7. Identifier results
    Given no special config for full empathize view
    When  a "<query>" with results is typed
    Then  identifier results are displayed
    When  clear search button is pressed
    Then  no identifier results are displayed
    When  a "<query>" with results is typed
    And   identifier results number <identifierResultItem> is clicked
    Then  user is redirected to the product page

    Examples:
      | query | identifierResultItem |
      | a03   | 1                    |

  Scenario Outline: 8. Keyboard navigation
    Given no special config for full empathize view
    When  a "<query>" with results is typed
    And   query suggestions are displayed
    And   search-box position is stored
    When  down arrow is pressed 3 times
    Then  next element position is "below"
    And   right arrow is pressed 1 times
    Then  next element position is "on the right"
    When  down arrow is pressed 1 times
    Then  next element position is "below"
    When  left arrow is pressed 1 times
    Then  next element position is "on the left"
    When  up arrow is pressed 1 times
    Then  next element position is "above"

    Examples:
      | query |
      | lego  |

  Scenario: 9. Empathize is displayed
    Given no special config for full empathize view
    When  search-input is not focused
    Then  empathize is not displayed
    When  search-input is focused
    Then  empathize is displayed
    When  clear search button is pressed
    Then  search-input is not focused
    And   empathize is not displayed



