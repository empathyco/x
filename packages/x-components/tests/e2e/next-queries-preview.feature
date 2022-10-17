Feature: Next queries preview component

  Background:

    Given a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a recommendations API with a known response
    And   a tracking API

  Scenario Outline: 1. Next Queries preview shows N results for the first NQ in the NQ group
    Given a results API with 50 results
    And   a next queries API with a known response
    And   following config: hide if equals query <maxItemsToRender>, show only after offset true
    And   start button is clicked
    When  "<query>" is searched
    Then  related results are displayed
    When 	scrolling down to result "<resultId>"
    Then 	next queries preview name is shown and it is clickable
    And 	<maxItemsToRender> results are shown for next queries preview

    Examples:
      | query  | resultId  | maxItemsToRender |
      | pulpo  | result-23 | 15               |

  Scenario Outline: 2. Clicking on items leads to new URLs
    Given a results API with 50 results
    And   a next queries API with a known response
    And   following config: hide if equals query 10, show only after offset true
    And   start button is clicked
    When  "<query>" is searched
    And   related results are displayed
    When 	scrolling down to result "<resultId>"
    And   "<clickedItem>" is clicked
    Then  new "<newURL>" URL is opened

    Examples:
      | query  | resultId  | clickedItem                | newURL        |
      | pulpo  | result-23 | view-all-results           | results-page  |
      | pulpo  | result-23 | next-query                 | results-page  |
      | pulpo  | result-23 | next-query-preview-result  | pdp           |

  Scenario Outline: 3. No Next Query Preview is shown if there are no Next Queries
    Given a results API with 50 results
    And   a next queries API with no next queries
    And   following config: hide if equals query 10, show only after offset true
    And   start button is clicked
    When  "<query>" is searched
    Then  related results are displayed
    When 	scrolling down to result "<resultId>"
    Then  next queries preview are displayed is false

    Examples:
      | query  | resultId  |
      | pulpo  | result-23 |

  Scenario Outline: 4. ShowOnlyAfterOffset determines next queries preview visualization
    Given a results API with 10 results
    And   a next queries API with a known response
    And   following config: hide if equals query 10, show only after offset <showOnlyAfterOffset>
    And   start button is clicked
    When  "<query>" is searched
    Then  related results are displayed
    When 	scrolling down to result "<resultId>"
    Then  next queries preview are displayed is <nextQueriesPreviewAreShown>

    Examples:
      | query  | resultId  | showOnlyAfterOffset | nextQueriesPreviewAreShown |
      | pulpo  | result-9  | true                | false                      |
      | pulpo  | result-9  | false               | true                       |

