Feature: Preselected filters

  Background:
    Given a next queries API
    And   a suggestions API
    And   a related tags API
    And   a tracking API
    And   a recommendations API with a known response
    And   a results API with a known response

  Scenario Outline: 1. Preselected filter are selected is there is no more filters in the url
    Given   an application the "<filter>" filter preselected
    When  start button is clicked
    And  "<query>" is searched
    Then  related results are displayed
    And   url contains parameter "filter" with value "<filter>"
    And filters "<filter>" are shown in the selected filters

    Examples:
      | query | filter                |
      | lego  | brand_facet:Construye |

  Scenario Outline: 2. Preselected filter are not applied when there are other filters in the url
    Given   an application the "<filter>" filter preselected
    Given a URL with a filter parameter "<parameter>"
    When  start button is clicked
    And  "<query>" is searched
    Then  related results are displayed
    And   url contains parameter "filter" with value "<parameter>"
    And filters "<parameter>" are shown in the selected filters
    When the page is reloaded
    Then  related results are displayed
    And   url contains parameter "filter" with value "<parameter>"
    And filters "<parameter>" are shown in the selected filters

    Examples:
      | query | filter                | parameter                |
      | lego  | brand_facet:Construye | brand_facet:Construcción |
