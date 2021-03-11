Feature: Related tags component

  Scenario Outline: 1. Related tag is selected
    Given following config: requested items <maxItemsToRequest>, add to search-box <addToSearchBox>
    When  "<query>" is searched
    Then  related results are displayed
    And   at most <maxItemsToRequest> unselected related tags are displayed
    When  related tag number <relatedTagItem> is clicked
    Then  clicked related tag is shown in position 0 as selected
    And   clicked related tag is added to the search-box is <addToSearchBox>
    And   related results have changed
    And   related results are displayed
    When  related tag number 0 is clicked
    Then  related tag number 0 is shown as not selected
    And   related results have changed
    Examples:
      | maxItemsToRequest | addToSearchBox | query     | relatedTagItem |
      | 3                 | false          | barbie     | 1              |

  Scenario Outline: 2. Multiple related tags are selected
    Given following config: requested items <maxItemsToRequest>, add to search-box <addToSearchBox>
    When  "<query>" is searched
    Then  at most <maxItemsToRequest> unselected related tags are displayed
    When  related tag number <relatedTagItem> is clicked
    Then  clicked related tag is shown in position 0 as selected
    And   clicked related tag is added to the search-box is <addToSearchBox>
    And   related results are displayed
    And   related tags have changed
    And   at most <maxItemsToRequest> unselected related tags are displayed
    When  related tag number <relatedTagItem2> is clicked
    Then  clicked related tag is shown in position 1 as selected
    And   clicked related tag is added to the search-box is <addToSearchBox>
    And   related tags have changed
    When  related tag number 0 is clicked
    Then  clicked related tag is not displayed but at least one remains

    Examples:
      | maxItemsToRequest | addToSearchBox | query  | relatedTagItem | relatedTagItem2 |
      | 5                 | false          | funko  | 0              | 1               |

  Scenario Outline: 3. Related tag persistence
    Given following config: requested items <maxItemsToRequest>, add to search-box <addToSearchBox>
    When  "<query>" is searched
    And   related tag number <relatedTagItem> is clicked
    Then  clicked related tag is shown in position 0 as selected
    When  clear search button is pressed
    Then  no related tags are displayed

    Examples:
      | maxItemsToRequest | addToSearchBox | query     | relatedTagItem |
      | 5                 | false          | lego      | 2              |

