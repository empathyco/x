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
    And   filter number <multiselectFilter1> is clicked in facet "<facetName>"
    Given a results API with no results
    When  waiting for search request intercept
    When  "<query2>" replaces current query
    Then no results message is displayed
    Given a results API with a known response
    Then  url not contains parameter "filter"
    And   fallback disclaimer is displayed
    Examples:
      | query | query2            | multiselectFilter1 | facetName   |
      | lego  | lego super mario  |       3            | price_facet |
