Feature: Semantic-queries component

  Background:
    Given a semantic queries API
    And   a popular searches API
    And   a tracking API
    And   a query suggestions API
    And   a next queries API
    And   a related tags API
    And   a recommendations API with a known response
    And   a clean semantic queries config

  Scenario Outline: 1. Semantic queries are rendered if the results number is lower than the threshold
    Given a semantic queries threshold config of <threshold>
    And   a semantic queries max items to request config of <maxItemsToRequest>
    And   a results API with <resultsNumber> results
    Then  application is initialized with the custom semantic queries config
    When  start button is clicked
    And   "<query>" is searched
    Then  related results are displayed
    And   <maxItemsToRequest> semantic queries are requested
    And   semantic queries are displayed
    And   semantic queries results are displayed

    Examples:
      | threshold | resultsNumber | query  | maxItemsToRequest |
      | 4         | 4             | jacket | 2                 |

  Scenario Outline: 2. Semantic queries are rendered if there are no results
    Given no special config for layout view
    And   a results API with no results
    And   a results API with a known response for semantic queries
    When  start button is clicked
    And   "<query>" is searched
    Then  semantic queries are displayed
    And   semantic queries results are displayed

    Examples:
      | query  |
      | jacket |

  Scenario Outline: 3. Semantic queries are not rendered if the results number is higher than the threshold
    Given a semantic queries threshold config of <threshold>
    And   a results API with <resultsNumber> results
    Then  application is initialized with the custom semantic queries config
    When  start button is clicked
    And   "<query>" is searched
    Then  related results are displayed
    And   semantic queries request is not fired after <msToWaitForRequest> ms
    And   semantic queries are not displayed

    Examples:
      | threshold | resultsNumber | query  | msToWaitForRequest |
      | 5         | 6             | jacket | 200                |
