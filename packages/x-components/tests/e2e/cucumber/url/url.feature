Feature: Url component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API

  Scenario Outline: 1. Navigating to a URL from the outside sets the url origin as "<origin>"
    Given a URL with query parameter "<query>"
    And   waiting for search request intercept with new origin
    Then  the search request contains the origin "<origin>"
    Examples:
      | query | origin        |
      | lego  | url:external  |

  Scenario Outline: 2. Navigate back and forth in serp sets the url origin as "<origin>"
    Given a URL with query parameter "<query>"
    When  sort option "<sort>" is selected from the sort "dropdown"
    And   waiting for search request intercept with new origin
    Then  navigate back
    Then  the search request contains the origin "<origin>"
    Examples:
      | query | sort          | origin            |
      | playmobil  | price asc     | url:url_history   |

  Scenario Outline: 3. Navigate back from pdp to serp sets the url origin as "<origin>"
    Given a URL with query parameter "<query>"
    Then  click result in position 0
    And   waiting for search request intercept with new origin
    Then  navigate back
    Then  the search request contains the origin "<origin>"
    Examples:
      | query | origin              |
      | barbie  | url:url_history_pdp |


