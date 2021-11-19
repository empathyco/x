Feature: Exclude filters with no results component

  Background:
    Given a results API with 24 results
    And   a next queries API
    And   no special config for layout view

  Scenario Outline: 1. Scroll is kept in the URL
    When  start button is clicked
    And   "<query>" is searched
    Then  related results are displayed
    When  scrolling down to result "<resultId>"
    Then  url is updated with result "<resultId>"
    When  tab is reloaded
    Then  related results are displayed
    And   first visible result is "<resultId>"

    Examples:
      | query | resultId  |
      | lego  | result-12 |
