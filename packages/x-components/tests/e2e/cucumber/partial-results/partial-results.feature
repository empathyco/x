Feature: Partial results component

  Background:
    Given a related tags API with a known response
    And   a query suggestions API with a known response
    And   a next queries API with a known response
    And   a recommendations API with a known response

  Scenario Outline:  1. Shows no partial results if there are enough results
    Given a results API
    And   no special config for layout view
    And   start button is clicked
    When  "<query>" is searched
    Then  at least 4 related results are displayed
    And   no partial results are displayed

    Examples:
      | query  |
      | lego   |

  Scenario Outline: 2. Show partial results if there are not enough results
    Given a results API with partial results
    And   no special config for layout view
    And   start button is clicked
    When  "<query>" is searched
    Then  less than 4 related results are displayed
    And   partial results are displayed

    Examples:
      | query             |
      | lego verde y azul |

  Scenario Outline: 3. Click on partial query button launches new search
    Given a results API with partial results
    And   no special config for layout view
    And   start button is clicked
    When  "<query>" is searched
    Then  less than 4 related results are displayed
    And   partial results are displayed
    And   "<query>" contains the partial query
    When  a results API
    And   first partial query button is clicked
    Then  first partial query is displayed in the search-box
    And   at least 4 related results are displayed
    And   no partial results are displayed

    Examples:
      | query             |
      | lego verde y azul |


