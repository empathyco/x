Feature: Preselected filters

  Background:
    Given a next queries API
    And   a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a tracking API
    And   a recommendations API with a known response
    And   a results API with a known response

  Scenario Outline: 1. Preselected filters are applied when there are no other filters in the url
    Given an application with "<preselectedFilter>" filter preselected
    When  start button is clicked
    Then  url doesn't contain parameter "filter" with value "<preselectedFilter>"
    When  "<query>" is searched
    Then  related results are displayed
    And   url contains parameter "filter" with value "<preselectedFilter>"
    And   filter "<filterValue>" is selected

    Examples:
      | query | preselectedFilter     | filterValue |
      | lego  | brand_facet:Construye | Construye   |

  Scenario Outline: 2. Preselected filters are not applied when there are other filters in the url
    Given an application with "<preselectedFilter>" filter preselected
    And   a URL with a filter parameter "<urlFilter>"
    Then  url doesn't contain parameter "filter" with value "<preselectedFilter>"
    When  start button is clicked
    And   "<query>" is searched
    Then  related results are displayed
    And   url contains parameter "filter" with value "<urlFilter>"
    And   url doesn't contain parameter "filter" with value "<preselectedFilter>"
    And   filter "<urlFilterValue>" is selected
    And   filter "<preselectedFilterValue>" is not selected
    When  the page is reloaded
    Then  related results are displayed
    And   url contains parameter "filter" with value "<urlFilter>"
    And   url doesn't contain parameter "filter" with value "<preselectedFilter>"
    And   filter "<urlFilterValue>" is selected
    And   filter "<preselectedFilterValue>" is not selected

    Examples:
      | query | preselectedFilter     | preselectedFilterValue | urlFilter                | urlFilterValue  |
      | lego  | brand_facet:Construye | Construye              | brand_facet:Construcción | Construcción    |
