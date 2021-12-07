Feature: Base result image component

  Background:
    Given a results API with broken images
    And   a recommendations API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API
    And   a tracking API
    And   no special config for layout view
    And   start button is clicked

  Scenario Outline: 1. Placeholders are replaced for images or fallbacks in case it is not possible to load the images
    And   "<query>" is searched
    Then  results display placeholder images before pertinent images are loaded
    And   result 0 with working image or mix of working and broken ones is displayed
    And   result 1 with broken images display a fallback image
    And   result 2 with working image or mix of working and broken ones is displayed

    Examples:
      | query |
      | lego  |
