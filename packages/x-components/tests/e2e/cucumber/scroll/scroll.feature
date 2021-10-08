Feature: Scroll component
  Background:
    Given a results scroll API with a known response
    Given a related tags API with a known response
    Given a next queries API with a known response
    Given a recommendations API with a known response
    Given a query suggestions API with a known response
  Scenario Outline: 1. The first element in the scroll viewport is set in the URL
    Given following basic config
    And start button is clicked
    When  "<query>" is searched
    Then  related results are displayed
    Then  scroll down the results
    And   the first element id in the scroll viewport is in the url
    Examples:
    | query |
    | lego  |
