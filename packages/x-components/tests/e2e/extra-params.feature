Feature: Extra-params component

  Background:
    Given a next queries API
    And   a results API with a known response
    And   a query suggestions API
    And   a popular searches API with a known response
    And   a related tags API
    And   a recommendations API with a known response
    And   a tracking API
    And   no special config for layout view
    And   start button is clicked

  Scenario Outline: 1. Search request includes extra-params from Snippet Config
    When  "<query>" is searched
    And   search request contains extra parameter "<ExtraParamName>" with value "<ExtraParamValue>"
    And   related results are displayed

    Examples:
      | query | ExtraParamName | ExtraParamValue |
      | lego  | store          | Portugal        |

  Scenario Outline: 2. Search request includes renderless extra-param
    When  "<query>" is searched
    Then  search request contains extra parameter "<RenderlessExtraParamName>" with value "<InitialExtraParamValue>"
    And   related results are displayed
    When  store is changed to "<RenderlessExtraParamValue>"
    Then  search request contains extra parameter "<RenderlessExtraParamName>" with value "<RenderlessExtraParamValue>"

    Examples:
      | query | RenderlessExtraParamName | InitialExtraParamValue | RenderlessExtraParamValue |
      | lego  | store                    | Portugal               | Spain                     |

  Scenario Outline: 3. Immediate requests includes correct extra-params
    Then  recommendations request contains extra parameter "<ExtraParamName>" with value "<InitialExtraParamValue>"
    And   popular searches request contains extra parameter "<ExtraParamName>" with value "<InitialExtraParamValue>"
    When  "<query>" is searched
    And   store is changed to "<NewExtraParamValue>"
    Then  recommendations request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"
    And   popular searches request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"
    And   the page is reloaded
    Then  recommendations request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"
    And   popular searches request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"

    Examples:
      | query | ExtraParamName | InitialExtraParamValue | NewExtraParamValue |
      | lego  | store          | Portugal               | Spain              |
