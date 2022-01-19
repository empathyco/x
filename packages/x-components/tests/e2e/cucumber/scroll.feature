Feature: Exclude filters with no results component

  Background:
    Given a results API with 24 results
    And   a next queries API
    And   a tracking API
    And   no special config for layout view

  Scenario Outline: 1. Scroll is kept in the URL
    When  start button is clicked
    And   "<query>" is searched
    Then  related results are displayed
    When  scrolling down to result "<resultId>"
    Then  url is updated with result "<resultId>"
    When  tab is reloaded
    Then  related results are displayed
    And   first visible result is "<resultId>"

    Examples:
      | query | resultId  |
      | lego  | result-12 |

  Scenario Outline: 2. Scroll position is reset when a new query is searched
    When  start button is clicked
    And   "<query1>" is searched
    Then  related results are displayed
    When  scrolling down to result "<resultId>"
    And  "<query2>" is searched
    Then scroll position is at top

    Examples:
      | query1 | resultId  | query2         |
      | lego   | result-12 | lego star wars |

  Scenario Outline: 3. Scroll position is reset when a new filter is clicked
    When  start button is clicked
    And   "<query1>" is searched
    Then  related results are displayed
    When  scrolling down to result "<resultId>"
    And  filter number <filterIndex> is clicked in facet "<filterFacet>"
    Then scroll position is at top
    When  scrolling down to result "<resultId>"
    And  filter number <filterIndex> is clicked in facet "<filterFacet>"
    Then scroll position is at top

    Examples:
      | query1 | resultId  | filterIndex | filterFacet |
      | lego   | result-12 | 1           | brand_facet |

  Scenario Outline: 4. Scroll position is reset when a related tag is clicked
    Given a related tags API with a known response
    When  start button is clicked
    And   "<query1>" is searched
    Then  related results are displayed
    When  scrolling down to result "<resultId>"
    And  related tag number <relatedTagIndex> is clicked
    Then scroll position is at top
    When scrolling down to result "<resultId>"
    And related tag number <relatedTagIndex> is clicked
    Then scroll position is at top

    Examples:
      | query1 | resultId  | relatedTagIndex |
      | lego   | result-12 | 0               |

  Scenario Outline: 5. Scroll position is reset when an extra param is changed
    When  start button is clicked
    And   "<query1>" is searched
    Then  related results are displayed
    When  scrolling down to result "<resultId>"
    And  store is changed to "<store>"
    Then scroll position is at top

    Examples:
      | query1 | resultId  | store |
      | lego   | result-12 | Italy |
