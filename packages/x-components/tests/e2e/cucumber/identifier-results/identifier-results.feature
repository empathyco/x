Feature: Identifier results component

  Background:
    Given   no special config for identifier results view

  Scenario Outline: 1. ID search with results is made
    Given an ID results API with a known response
    And   start button is clicked
    When  "<query>" is searched
    Then  identifier results are displayed

    Examples:
      | query |
      | a02   |

  Scenario Outline: 2. ID search with no results is made
    Given an ID results API with no results
    And   start button is clicked
    When  "<query>" is searched
    Then  no identifier results are displayed

    Examples:
      | query |
      | b123  |

  Scenario Outline: 3. No ID search is made
    Given an ID results API with a known response
    And   start button is clicked
    When  "<query>" is searched
    Then  no identifier results are displayed

    Examples:
      | query |
      | 1a    |
