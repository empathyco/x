Feature: Recommendations component

  Scenario Outline:  1. Recommendations are displayed
    Given following config: max items to store is <maxItemsToRequest>
    And   suggestions response being mock "<mock>"
    Then  number of rows requested is <maxItemsToRequest>
    Then  number of displayed recommendations are equal or less than <maxItemsToRequest>
    And   each recommendation has an associated hyperlink containing image and text

    Examples:
      | maxItemsToRequest | mock    |
      | 3                 | default |
      | 160               | default |
