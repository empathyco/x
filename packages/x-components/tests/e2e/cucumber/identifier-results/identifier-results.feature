Feature: Identifier results component

  Background:
    Given a related tags API with a known response
    And   a query suggestions API with a known response
    And   a next queries API with a known response
    And   a recommendations API with a known response
    And   a results API with no results
    And   no special config for layout view

  Scenario Outline: 1. ID search with results is made
    Given an ID results API with a known response
    And   start button is clicked
    When  "<query>" is searched
    Then  identifier results are displayed

    Examples:
      | query |
      | 01   |

  Scenario Outline: 2. ID search with no results is made
    Given an ID results API with no results
    And   start button is clicked
    When  "<query>" is searched
    Then  no identifier results are displayed

    Examples:
      | query |
      | 23  |

  Scenario Outline: 3. No ID search is made
    Given an ID results API with a known response
    And   start button is clicked
    When  "<query>" is searched
    Then  no identifier results are displayed

    Examples:
      | query |
      | lego    |
