Feature: Spellcheck component

  Background:
    Given no special config for spellcheck view

  Scenario Outline: 1. Misspelled word is searched
    When   "<misspelledQuery>" is searched
    Then   spellcheck component is shown and its button contains the spellchecked query "<spellcheckedQuery>"

    Examples:
      | misspelledQuery | spellcheckedQuery |
      | brbie           | barbie            |
      | fnko            | funko             |

  Scenario Outline: 2. Correct word is searched
    When  "<query>" is searched
    Then  spellcheck component is not shown
    Examples:
      | query  |
      | barbie |
      | funko  |

  Scenario Outline: 3. Clicking spellcheck button changes query in search-box
    When  "<misspelledQuery>" is searched
    Then  the searched query is displayed in the search-box
    And   spellcheck button contains the spellchecked query "<spellcheckedQuery>"
    When  spellcheck button is clicked
    Then  the spellchecked query is displayed in the search-box

    Examples:
      | misspelledQuery | spellcheckedQuery |
      | brbie           | barbie            |
