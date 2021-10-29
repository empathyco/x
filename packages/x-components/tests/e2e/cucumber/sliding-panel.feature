Feature: Sliding panel component

  Background:
    Given a related tags API
    And   a results API with a known response
    And   no special config for layout view
    And   start button is clicked


  Scenario Outline: 1. Shows only needed arrow buttons and related tags change when those are clicked
    When  "<query>" is searched
    Then  "right" sliding panel arrow is displayed
    And   only some related tags are visible
    When  right sliding panel arrow is clicked
    And   wait for the movement of the elements inside the sliding panel
    Then  visible related tags have changed
    And   "both" sliding panel arrow is displayed
    And   only some related tags are visible
    When  right sliding panel arrow is clicked
    And   wait for the movement of the elements inside the sliding panel
    Then  visible related tags have changed
    And   "left" sliding panel arrow is displayed

    Examples:
      | query |
      | lego  |
