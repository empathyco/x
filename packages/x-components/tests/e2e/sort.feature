Feature: Search sort components

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

  Scenario Outline: 1. Search sort list and dropdown order the results
    Given a results API with a known response
    When  "<query>" is searched
    Then  search request contains sort parameter with value "<defaultSort>"
    Then  related results are displayed
    When  sort option "<sortOption2>" is selected from the sort dropdown
    Then  search request contains sort parameter with value "<sortOption2>"
    When  sort option "<sortOption1>" is selected from the sort dropdown
    Then  search request contains sort parameter with value "<sortOption1>"
    When  sort option "<defaultSort>" is selected from the sort dropdown
    Then  search request contains sort parameter with value "<defaultSort>"

    Examples:
      | query | sortOption1   | sortOption2    | defaultSort |
      | lego  | price asc     | price desc     | default     |
