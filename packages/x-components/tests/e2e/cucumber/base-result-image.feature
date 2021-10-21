Feature: Base result image component

  Background:
    Given a results API with fallback images
    And   a recommendations API with a known response
    And   a next queries API
    And   a suggestions API
    And   a related tags API
    And   no special config for layout view
    And   start button is clicked

  Scenario Outline: 1. Placeholders are replaced for images or fallbacks in case it is not possible to load the images
    And   "<query>" is searched
    Then  related results are displayed
    And   placeholder 0 is replaced for "<image>"
    And   placeholder 1 is replaced for "<fallback>"
    And   placeholder 2 is replaced for "<imagesAndFallbacks>"

    Examples:
      | query | image                  | fallback                  | imagesAndFallbacks    |
      | lego  | result-picture__image  | result-picture__fallback  | result-picture__image |
