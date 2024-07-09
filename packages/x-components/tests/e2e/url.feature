Feature: Url component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a tracking API

  Scenario Outline: 1. Navigating to a URL from the outside sets the url origin as "<origin>"
    Given a URL with query parameter "lego"
    Then  search request contains parameter "origin" with value "<origin>"

    Examples:
      | origin       |
      | url:external |

  Scenario Outline: 2. Navigate back and forth in serp sets the url origin as "<origin>"
    Given a URL with query parameter "lego"
    Then  search request contains parameter "origin" with value "url:external"
    When  sort option "<sort>" is selected from the sort dropdown
    Then  search request contains parameter "origin" with value "url:external"
    When  navigating back
    Then  search request contains parameter "origin" with value "url:url_history"

    Examples:
      | sort      |
      | price asc |

  Scenario: 3. Navigate back from pdp to serp sets the url origin as "<origin>"
    Given a URL with query parameter "lego"
    Then  search request contains parameter "origin" with value "url:external"
    When  clicking result in position 0
    And   navigating back
    Then  search request contains parameter "origin" with value "url:url_history_pdp"

  Scenario Outline: 4. Extra params are properly restored when navigating
    Given a URL with query parameter "lego"
    Then  search request contains extra parameter "store" with value "<defaultStore>"
    And   url doesn't contain parameter "store" with value "<defaultStore>"
    When  selecting store "<store2>"
    Then  search request contains extra parameter "store" with value "<store2>"
    And   url contains parameter "store" with value "<store2>"
    When  selecting store "<store3>"
    Then  search request contains extra parameter "store" with value "<store3>"
    And   url contains parameter "store" with value "<store3>"
    When  navigating back
    Then  search request contains extra parameter "store" with value "<store2>"
    And   url contains parameter "store" with value "<store2>"
    When  navigating back
    Then  search request contains extra parameter "store" with value "<defaultStore>"
    And   url doesn't contain parameter "store" with value "<defaultStore>"

    Examples:
      | defaultStore | store2 | store3 |
      | Portugal     | Italy  | Spain  |


  Scenario Outline: 5. Typing a new query clears the filters
    Given a URL with query parameter "<query>"
    When  filter number <simpleFilter1> is clicked in facet "<facetName>"
    Then  url contains parameter "filter" with value "price_facet:0-10"
    When  "<query2>" is added to the search
    Then  url contains parameter "q" with value "<query> <query2>"
    And   url contains parameter "filter" with value "price_facet:0-10"
    When  "<query3>" replaces current query
    Then  url contains parameter "q" with value "<query3>"
    And   url not contains parameter "filter"

    Examples:
      | query | query2      | query3   | simpleFilter1 | facetName   |
      | lego  | marvel      | camion   | 0             | price_facet   |

