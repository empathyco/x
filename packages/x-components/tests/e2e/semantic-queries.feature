Feature: Semantic-queries component

  Background:
    Given a semantic queries API
    And a popular searches API
    And a tracking API
    And a query suggestions API
    And a next queries API
    And a related tags API
    And a recommendations API with a known response

  Scenario Outline: 1. Semantic queries are rendered if the results number is lower than the threshold
    Given an application with a semantic queries threshold of <threshold>
    And a results API with <resultsNumber> results
    When start button is clicked
    And "<query>" is searched
    Then related results are displayed
    And semantic queries are displayed
    And semantic queries results are displayed

    Examples:
      | threshold | resultsNumber | query  |
      | 5         | 4             | jacket |

  Scenario Outline: 2. Semantic queries are rendered if there are no results
    Given an application with a semantic queries threshold of <threshold>
    And a results API with no results
    And a results API with a known response for semantic queries
    When start button is clicked
    And "<query>" is searched
    Then semantic queries are displayed
    And semantic queries results are displayed

    Examples:
      | threshold | query  |
      | 5         | jacket |

  Scenario Outline: 3. Semantic queries are not rendered if the results number is higher than the threshold
    Given an application with a semantic queries threshold of <threshold>
    And a results API with <resultsNumber> results
    When start button is clicked
    And "<query>" is searched
    Then related results are displayed
    And semantic queries request is not fired after <msToWaitForRequest> ms
    And semantic queries are not displayed

    Examples:
      | threshold | resultsNumber | query  | msToWaitForRequest |
      | 5         | 6             | jacket | 200                |
