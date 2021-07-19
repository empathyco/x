Feature: Identifier results component

  Background:
    Given no special config for identifier results view

  Scenario Outline: 1. ID search with results is made
    When  skusearch request is being intercepted for the query "<query>"
    And   "<query>" is searched
    Then  skusearch request with query "<query>" is made
    And   identifier results are displayed

    Examples:
      | query |
      | a02   |
      | a0    |

  Scenario Outline: 2. ID search with no results is made
    When  skusearch request is being intercepted for the query "<query>"
    And   "<query>" is searched
    Then  skusearch request with query "<query>" is made
    And   no identifier results are displayed

    Examples:
      | query |
      | b123  |
      | c0 32 |
