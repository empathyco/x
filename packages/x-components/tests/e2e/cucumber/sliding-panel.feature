Feature: Sliding panel component

  Scenario: 1. Shows only needed arrow buttons and related tags change when those are clicked
    Given no special config for sliding-panel view
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
