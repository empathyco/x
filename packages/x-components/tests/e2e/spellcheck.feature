Feature: Spellcheck component

  Background:
    Given a recommendations API with a known response
    And   a next queries API
    And   a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a tracking API
    And   no special config for layout view
    And   start button is clicked

  Scenario Outline: 1. Misspelled word is searched
    Given a results API response for a misspelled word
    When  "<misspelledQuery>" is searched
    Then  spellcheck component is shown and its button contains the spellchecked query "<spellcheckedQuery>"

    Examples:
      | misspelledQuery | spellcheckedQuery |
      | lgo             | lego              |

  Scenario Outline: 2. Correct word is searched
    Given a results API with a known response
    When  "<query>" is searched
    Then  spellcheck component is not shown

    Examples:
      | query  |
      | lego   |

  Scenario Outline: 3. Clicking spellcheck button changes query in search-box
    Given a results API response for a misspelled word
    When  "<misspelledQuery>" is searched
    Then  the searched query is displayed in the search-box
    And   spellcheck button contains the spellchecked query "<spellcheckedQuery>"
    When  spellcheck button is clicked
    Then  the spellchecked query is displayed in the search-box

    Examples:
      | misspelledQuery | spellcheckedQuery |
      | lgo             | lego              |
