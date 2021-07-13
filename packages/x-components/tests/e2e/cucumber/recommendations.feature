Feature: Recommendations component

  Scenario Outline:  1. Recommendations are displayed
    Given following config: max items to store is <maxItemsToRequest>
    Then  number of displayed recommendations are equal or less than <maxItemsToRequest>
    And   each recommendation has an associated hyperlink containing image and text

    Examples:
      | maxItemsToRequest |
      | 7                 |
      | 160               |
