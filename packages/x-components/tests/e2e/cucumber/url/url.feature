Feature: Url component

  Background:
    Given a results API with a known response
    And   a recommendations API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API
    And   a tracking API

  Scenario Outline: 1. Navigating to a URL from the outside sets the url origin as "<origin>"
    Given a URL with query parameter "lego"
    Then  the search request contains the origin "<origin>"
    Examples:
      | origin       |
      | url:external |

  Scenario Outline: 2. Navigate back and forth in serp sets the url origin as "<origin>"
    Given a URL with query parameter "lego"
    Then  the search request contains the origin "url:external"
    When  sort option "<sort>" is selected from the sort "dropdown"
    Then  the search request contains the origin "url:external"
    When  navigating back
    Then  the search request contains the origin "<origin>"
    Examples:
      | sort      | origin          |
      | price asc | url:url_history |

  Scenario Outline: 3. Navigate back from pdp to serp sets the url origin as "<origin>"
    Given a URL with query parameter "lego"
    Then  the search request contains the origin "url:external"
    When  click result in position 0
    And   navigating back
    Then  the search request contains the origin "<origin>"
    Examples:
      | origin              |
      | url:url_history_pdp |


