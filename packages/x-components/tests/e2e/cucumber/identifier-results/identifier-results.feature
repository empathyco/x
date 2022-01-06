Feature: Identifier results component

  Background:
    Given following config: identifier detection Regexp "^[0-9]{2,}$"

  Scenario Outline: 1. ID search with results is made
    Given an ID results API with a known response
    And   start button is clicked
    When  a "<query>" with results is typed
    Then  identifier results are displayed

    Examples:
      | query |
      | 01    |

  Scenario Outline: 2. ID search with no results is made
    Given an ID results API with no results
    And   start button is clicked
    When  a "<query>" with results is typed
    Then  no identifier results are displayed

    Examples:
      | query |
      | 23    |

  Scenario Outline: 3. No ID search is made
    Given an ID results API with a known response
    And   start button is clicked
    When  a "<query>" with results is typed
    Then  no identifier results are displayed

    Examples:
      | query |
      | lego  |
