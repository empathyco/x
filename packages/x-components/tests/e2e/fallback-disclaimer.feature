Feature: Fallback disclaimer component

  Background:
    Given a results API
    And   a recommendations API with a known response
    And   a next queries API
    And   a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a tracking API
    And   no special config for layout view
    And   start button is clicked

  Scenario Outline: 1. Fallback disclaimer is displayed when there is no results with filters
    Given a results API with a known response
    When  "<query>" is searched
    Then  related results are displayed
    And   filter number <filterNumber> is clicked in facet "<facetName>"
    Given a results API with no results
    When  waiting for search request intercept
    And   "<query2>" replaces current query
    Then  fallback disclaimer is displayed
    Given a results API with a known response
    When  "<query>" is searched
    Then  related results are displayed

    Examples:
      | query | query2            | filterNumber | facetName   |
      | lego  | lego super mario  | 3            | price_facet |

  Scenario Outline: 2. Fallback disclaimer is not displayed when there is no results
    Given a results API with no results
    When  "<query>" is searched
    Then  no results message is displayed
    And   fallback disclaimer is not displayed

    Examples:
      | query |
      | lego  |
