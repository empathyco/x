Feature: Identifier results component

  Background:
    Given following config: identifier detection Regexp "^[0-9]{2,}$"

  Scenario: 1. ID search shows results and clears them when a non id query is made
    Given an ID results API with a known response
    And   start button is clicked
    When  a "01" with results is typed
    Then  identifier results are displayed
    When  a "lego" with results is typed
    Then  no identifier results are displayed

  Scenario: 2. ID search shows results and clears them when a id query with no results is made
    Given an ID results API with a known response
    And   start button is clicked
    When  a "01" with results is typed
    Then  identifier results are displayed
    Given an ID results API with no results
    When  a "23" with results is typed
    Then  no identifier results are displayed
