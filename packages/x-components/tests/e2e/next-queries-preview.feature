Feature: Next queries preview component

  Background:

    Given a results API with 50 results
    And   a next queries API with a known response
    And   a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a recommendations API with a known response
    And   a tracking API

  Scenario Outline: 1. Next Queries preview shows N results for the first NQ in the NQ group
    Given following config: hide if equals query <maxItemsToRender>
    And   start button is clicked
    When  "<query>" is searched
    Then  related results are displayed
    When 	scrolling down to result "<resultId>"
    Then 	next queries preview name is shown and it is clickable
    And 	<maxItemsToRender> results are shown for next queries preview

    Examples:
      | query  | resultId  | maxItemsToRender |
      | pulpo  | result-23 | 15                |
