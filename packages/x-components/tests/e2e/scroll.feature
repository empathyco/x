# TODO: Fix test and enable back
@skip
Feature: Scroll component

  Background:
    Given a results API with 24 results
    And   a next queries API
    And   a tracking API
    And   no special config for layout view

  Scenario Outline: 1. Scroll is kept in the URL
    When  start button is clicked
    Then  empathize should be visible
    When  "<query>" is searched
    Then  related results are displayed
    When  scrolling down to result "<resultId>"
    Then  url is updated with result "<resultId>"
    When  the page is reloaded
    Then  related results are displayed
    And   "<resultId>" result is visible

    Examples:
      | query | resultId  |
      | lego  | result-12 |

  Scenario Outline: 2. Scroll position is reset when a new query is searched
    When  start button is clicked
    Then  empathize should be visible
    When  "<query1>" is searched
    Then  related results are displayed
    When  scrolling down to result "<resultId>"
    And   "<query2>" is searched
    Then  scroll position is at top

    Examples:
      | query1 | resultId  | query2         |
      | lego   | result-12 | lego star wars |

  @regression
  Scenario Outline: 3. Scroll position is reset when query is cleared
    Given a results API with 2 pages
    When  start button is clicked
    Then  empathize should be visible
    When  "<query1>" is searched
    Then  related results are displayed
    When  sort option "<sortOption>" is selected from the sort dropdown
    When  scrolls down to next page
    Then  url contains parameter "q" with value "<query1>"
    Then  url contains parameter "page" with value "<page>"
    Then  url contains parameter "sort" with value "<sortOption>"
    When  clear search button is pressed
    And   "<query2>" is searched
    Then  url contains parameter "q" with value "<query2>"
    And   url not contains parameter "page"
    And   url not contains parameter "sort"

    Examples:
      | query1 | query2     | page  | sortOption |
      | lego   | star wars  | 2     | price asc  |

  Scenario Outline: 4. Scroll position is reset when a new filter is clicked
    When  start button is clicked
    Then  empathize should be visible
    When  "<query1>" is searched
    Then  related results are displayed
    When  scrolling down to result "<resultId>"
    And   filter number <filterIndex> is clicked in facet "<filterFacet>"
    Then  scroll position is at top
    When  scrolling down to result "<resultId>"
    And   filter number <filterIndex> is clicked in facet "<filterFacet>"
    Then  scroll position is at top

    Examples:
      | query1 | resultId  | filterIndex | filterFacet |
      | lego   | result-12 | 1           | brand_facet |

  Scenario Outline: 5. Scroll position is reset when a related tag is clicked
    Given a related tags API with a known response
    When  start button is clicked
    Then  empathize should be visible
    When  "<query1>" is searched
    Then  related results are displayed
    When  scrolling down to result "<resultId>"
    And   related tag number <relatedTagIndex> is clicked
    Then  scroll position is at top
    When  scrolling down to result "<resultId>"
    And   related tag number <relatedTagIndex> is clicked
    Then  scroll position is at top

    Examples:
      | query1 | resultId  | relatedTagIndex |
      | lego   | result-12 | 0               |

  Scenario Outline: 6. Scroll position is reset when an extra param is changed
    When  start button is clicked
    Then  empathize should be visible
    When  "<query1>" is searched
    Then  related results are displayed
    When  scrolling down to result "<resultId>"
    And   store is changed to "<store>"
    Then  scroll position is at top

    Examples:
      | query1 | resultId  | store |
      | lego   | result-12 | Italy |

  Scenario Outline: 7. Scroll direction is updated properly
    When  start button is clicked
    Then  empathize should be visible
    When  "<query1>" is searched
    Then  related results are displayed
    When  scrolling to bottom
    Then  scroll direction is DOWN
    When  scrolling to top
    Then  scroll direction is UP
    When  scrolling down to result "<resultId>"
    And   the page is reloaded
    Then  related results are displayed
    When  scrolling to bottom
    Then  scroll direction is DOWN
    When  scrolling to top
    Then  scroll direction is UP

    Examples:
      | query1 | resultId  |
      | lego   | result-8 |
