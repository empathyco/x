Feature: Related tags component

  Background:
    Given a related tags API with a known response
    And   a results API with a known response
    And   a tracking API

  Scenario Outline: 1. Related tag is selected
    Given following config: requested items <maxItemsToRequest>, add to search-box <addToSearchBox>
    And   start button is clicked
    When  "<query>" is searched
    Then  number of rows requested in "<request>" is <maxItemsToRequest>
    Then  related results are displayed
    And   at most <maxItemsToRequest> unselected related tags are displayed
    Given a related tags API with a selected one
    And   a results API
    When  related tag number <relatedTagItem> is clicked
    Then  clicked related tag is shown in position 0 as selected
    And   clicked related tag is added to the search-box is <addToSearchBox>
    And   raw related results are displayed
    And   related results have changed
    Given a related tags API with a selected one
    And   a results API with a known response
    When  related tag number 0 is clicked
    Then  related tag number 0 is shown as not selected
    And   related results have changed
    Examples:
      | maxItemsToRequest | addToSearchBox | query | relatedTagItem | request                |
      | 9                 | false          | lego  | 1              | interceptedRelatedTags |

  Scenario Outline: 2. Multiple related tags are selected
    Given following config: requested items <maxItemsToRequest>, add to search-box <addToSearchBox>
    And   start button is clicked
    When  "<query>" is searched
    Then  number of rows requested in "<request>" is <maxItemsToRequest>
    Then  at most <maxItemsToRequest> unselected related tags are displayed
    Given a related tags API with a selected one
    When  related tag number <relatedTagItem> is clicked
    Then  clicked related tag is shown in position 0 as selected
    And   clicked related tag is added to the search-box is <addToSearchBox>
    And   related results are displayed
    And   related tags have changed
    And   at most <maxItemsToRequest> unselected related tags are displayed
    Given a related tags API with a selected one
    When  related tag number <relatedTagItem2> is clicked
    Then  clicked related tag is shown in position <relatedTagItem2> as selected
    And   clicked related tag is added to the search-box is <addToSearchBox>
    And   related tags have changed
    Given a related tags API with a selected one
    When  related tag number <relatedTagItem> is clicked
    Then  clicked related tag is not displayed but at least one remains

    Examples:
      | maxItemsToRequest | addToSearchBox | query | relatedTagItem | relatedTagItem2 | request                |
      | 9                 | false          | funko | 0              | 1               | interceptedRelatedTags |

  Scenario Outline: 3. Related tag persistence
    Given following config: requested items <maxItemsToRequest>, add to search-box <addToSearchBox>
    And   start button is clicked
    When  "<query>" is searched
    Then  number of rows requested in "<request>" is <maxItemsToRequest>
    And   related tag number <relatedTagItem> is clicked
    Then  clicked related tag is shown in position 0 as selected
    When  clear search button is pressed
    Then  no related tags are displayed

    Examples:
      | maxItemsToRequest | addToSearchBox | query | relatedTagItem | request                |
      | 9                 | false          | lego  | 2              | interceptedRelatedTags |

