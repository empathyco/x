Feature: Preselected filters

  Background:
    Given a next queries API
    And   a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a tracking API
    And   a recommendations API with a known response
    And   a results API with a known response

  Scenario Outline: 1. Preselected filter are selected is there is no more filters in the url
    Given an application the "<filter>" filter preselected
    When  start button is clicked
    And   "<query>" is searched
    Then  related results are displayed
    And   url contains parameter "filter" with value "<filter>"
    And   filter "<filterLabel>" is selected

    Examples:
      | query | filter                | filterLabel |
      | lego  | brand_facet:Construye | Construye   |

  Scenario Outline: 2. Preselected filter are not applied when there are other filters in the url
    Given an application the "<filter>" filter preselected
    Given a URL with a filter parameter "<parameter>"
    When  start button is clicked
    And   "<query>" is searched
    Then  related results are displayed
    And   url contains parameter "filter" with value "<parameter>"
    And   filter "<filterLabel>" is selected
    When  the page is reloaded
    Then  related results are displayed
    And   url contains parameter "filter" with value "<parameter>"
    And   filter "<filterLabel>" is selected

    Examples:
      | query | filter                | parameter                | filterLabel  |
      | lego  | brand_facet:Construye | brand_facet:Construcción | Construcción |
