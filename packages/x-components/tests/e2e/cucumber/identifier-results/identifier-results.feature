Feature: Identifier results component

  Background:
    Given an ID results API with a known response
    And   no special config for identifier results view

  Scenario Outline: 1. ID search with results is made
    When  "<query>" is searched
    Then  identifier results are displayed

    Examples:
      | query |
      | a02   |

  Scenario Outline: 2. ID search with no results is made
    When  "<query>" is searched
    Then  no identifier results are displayed

    Examples:
      | query |
      | b123  |
      | c0 32 |
