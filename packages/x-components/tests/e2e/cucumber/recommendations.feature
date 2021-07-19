Feature: Recommendations component

  Scenario Outline:  1. Recommendations are displayed
    Given following config: max items to store is <maxItemsToRequest>
    Then  suggestions should respond with mock "<mock>"
    Then  number of displayed recommendations are equal or less than <maxItemsToRequest>
    And   each recommendation has an associated hyperlink containing image and text

    Examples:
      | maxItemsToRequest | mock |
      | 7                 | recommendations.stub |
      | 160               | recommendations.stub |
