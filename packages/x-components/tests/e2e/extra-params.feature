Feature: Extra-params component

  Background:
    Given a next queries API with a known response
    And   a results API with a known response
    And   a query suggestions API with a known response
    And   a popular searches API with a known response
    And   a related tags API with a known response
    And   a recommendations API with a known response
    And   a tracking API
    And   no special config for layout view
    And   start button is clicked

  Scenario Outline: 1. Search request includes extra-params
    Then  popular searches request contains extra parameter "<ExtraParamName>" with value "<InitialExtraParamValue>"
    And   recommendations request contains extra parameter "<ExtraParamName>" with value "<InitialExtraParamValue>"
    # This is the initial query preview request for the no-search carousels
    And   search request contains extra parameter "<ExtraParamName>" with value "<InitialExtraParamValue>"
    When  "<query>" is searched
    Then  query suggestions request contains extra parameter "<ExtraParamName>" with value "<InitialExtraParamValue>"
    And   search request contains extra parameter "<ExtraParamName>" with value "<InitialExtraParamValue>"
    And   next queries request contains extra parameter "<ExtraParamName>" with value "<InitialExtraParamValue>"
    And   related tags request contains extra parameter "<ExtraParamName>" with value "<InitialExtraParamValue>"
    When  store is changed to "<NewExtraParamValue>"
    Then  popular searches request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"
    And   query suggestions request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"
    And   recommendations request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"
    And   search request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"
    And   next queries request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"
    And   related tags request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"
    When  the page is reloaded
    Then  popular searches request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"
    And   query suggestions request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"
    And   recommendations request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"
    And   search request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"
    And   next queries request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"
    And   related tags request contains extra parameter "<ExtraParamName>" with value "<NewExtraParamValue>"

    Examples:
      | query | ExtraParamName | InitialExtraParamValue | NewExtraParamValue |
      | lego  | store          | Portugal               | Spain              |
