Feature: Recommendations component

  Background:
    Given a recommendations API with a known response

  Scenario Outline:  1. Recommendations are displayed
    Given following config: max items to store is <maxItemsToRequest>
    Then  number of rows requested in "<request>" is <maxItemsToRequest>
    And   number of displayed recommendations are equal or less than <maxItemsToRequest>
    And   each recommendation has an associated hyperlink containing image and text

    Examples:
      | maxItemsToRequest | request                    |
      | 3                 | interceptedRecommendations |
      | 160               | interceptedRecommendations |
