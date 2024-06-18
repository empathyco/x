Feature: Reload search

  Background:
    Given a results API with 24 results
    And   a tracking API with a known response
    And   no special config for layout view

  Scenario Outline: 1. Search is reloaded when event is emitted
    When  start button is clicked
    Then  empathize should be visible
    When  "<query>" is searched
    Then  results page number 1 is loaded
    And  search request contains parameter "query" with value "<query>"
    When  event ReloadSearchRequested is emitted
    Then  search request contains parameter "query" with value "<query>"

    Examples:
      | query |
      | lego  |
