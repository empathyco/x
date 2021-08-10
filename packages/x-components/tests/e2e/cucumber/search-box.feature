Feature: Search-box component

  Background:
    Given next queries API should respond with dummy next queries

  Scenario Outline: 1. Query with results is typed and <buttonOrKey> is clicked/pressed (search-box is empty)
    Given following config: hide if equals query <hideIfEqualsQuery>, instant search <instant>, debounce <instantDebounceInMs>
    And   no queries have been searched
    When  a "<query>" with results is typed
    And   "<buttonOrKey>" is clicked immediately after
    Then  related results are displayed
    And   query suggestions are displayed
    And   next queries are displayed
    And   related tags are displayed
    And   "<query>" is displayed in history queries is not <hideIfEqualsQuery>
    Examples:
      | hideIfEqualsQuery | instantDebounceInMs | instant | query         | buttonOrKey     |
      | true              | 5000                | false   | lego          | searchButton    |
      | false             | 5000                | false   | star wars     | enterKey        |

  Scenario Outline: 2. Query with results exists and it's cleared by <cleared> (search-box is not empty)
    Given following config: hide if equals query <hideIfEqualsQuery>, instant search <instant>, debounce <instantDebounceInMs>
    And   "<query>" is searched
    And   related results are displayed
    When  the "<query>" is cleared by "<cleared>"
    Then  the search box is empty
    And   related results are cleared
    And   query suggestions are cleared
    And   next queries are not cleared
    And   related tags are cleared
    And   the searched query is displayed in history queries
    Examples:
      | hideIfEqualsQuery | instantDebounceInMs | instant | query  | hideIfEqualsQuery | cleared         |
      | true              | 500                 | true    | lego   | false             | clickButton     |
      | false             | 500                 | true    | funko  | false             | manually        |

  Scenario Outline: 3. Query with results is typed and no button or key is pressed or clicked (search-box is empty)
    Given following config: hide if equals query <hideIfEqualsQuery>, instant search <instant>, debounce <instantDebounceInMs>
    And   no queries have been searched
    When  a "<query>" with results is typed - timestamp needed
    Then  no related results are displayed before <instantDebounceInMs>
    And   related results are displayed after <instantDebounceInMs> is <instant>
    And   next queries are displayed after instantDebounceInMs is <instant>
    And   related tags are displayed after instantDebounceInMs is <instant>
    Examples:
      | hideIfEqualsQuery | instantDebounceInMs     | instant  | query         |
      | true              | 1000                    | true     | playmobil     |
      | true              | 1000                    | false    | lego          |

  Scenario Outline: 4. Adding or deleting words from a query (search-box is empty)
    Given following config: hide if equals query <hideIfEqualsQuery>, instant search <instant>, debounce <instantDebounceInMs>
    And   no queries have been searched
    When  a "<firstQuery>" with results is typed - timestamp needed
    Then  no related results are displayed before <instantDebounceInMs>
    And   related results are displayed after <instantDebounceInMs> is <instant>
    When  "<secondQuery>" is added to the search
    Then  new related results are not displayed before <instantDebounceInMs>
    And   new related results are displayed after <instantDebounceInMs> is <instant>
    And   new related results are different from previous ones
    When  "<secondQuery>" is deleted from the search
    Then  old related results are not displayed before <instantDebounceInMs>
    And   related results are displayed after <instantDebounceInMs> is <instant>
    And   new related results are different from previous ones
    Examples:
      | hideIfEqualsQuery | instantDebounceInMs  | instant | firstQuery | secondQuery |
      | true              | 1000                 | true    | lego       | mickey      |
