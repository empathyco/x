Feature: Base result image component

  Scenario Outline: 1. Placeholders are replaced for images or fallbacks in case it is not possible to load the images
    Given no special config for base-result-image view
    And   3 picture placeholders with no final content loaded yet
    When  scroll down is performed
    Then  placeholder 0 is replaced for "<image>"
    And   placeholder 1 is replaced for "<fallback>"
    And   placeholder 2 is replaced for "<imagesAndFallbacks>"

    Examples:
      | image                  | fallback                  | imagesAndFallbacks    |
      | result-picture__image  | result-picture__fallback  | result-picture__image |



