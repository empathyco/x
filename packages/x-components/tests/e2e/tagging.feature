Feature: Tagging component

  Background:
    Given a next queries API
    And   a query suggestions API
    And   a popular searches API
    And   a related tags API
    And   a recommendations API with a known response
    And   a tracking API with a known response

  Scenario: 1. Navigating to a URL with a query triggers the query tagging.
    Given a results API with a known response
    And   a URL with query parameter "lego"
    Then  query tagging request should be triggered

  Scenario: 2. Searching triggers the query tagging.
    Given a results API with a known response
    And   no special config for layout view
    When  start button is clicked
    Then  empathize should be visible
    When  "lego" is searched
    Then  query tagging request should be triggered

  Scenario: 3. Clicking add to cart triggers click and add2cart tagging.
    Given a results API with a known response
    And   no special config for layout view
    When  start button is clicked
    Then  empathize should be visible
    When  "lego" is searched
    Then  query tagging request should be triggered
    And   related results are displayed
    Given a results API with a known response
    When  add to cart button from first result is clicked
    Then  result click tagging request is triggered
    And   add product to cart tagging request is triggered

  Scenario: 4. Infinite scrolling triggers query tagging
    Given a results API with 2 pages
    And   no special config for layout view
    When  start button is clicked
    Then  empathize should be visible
    When  "lego" is searched
    Then  results page number 1 is loaded
    And   query tagging request should be triggered
    When  scrolls down to next page
    Then  results page number 2 is loaded
    And   second page query tagging request is triggered

  Scenario: 5. Tracking PDP add to cart
    Given a results API with a known response
    And   no special config for layout view
    When  start button is clicked
    Then  empathize should be visible
    When  "lego" is searched
    Then  query tagging request should be triggered
    And   related results are displayed
    When  first result is clicked
    And   pdp is loaded
    When  pdp add to cart button is clicked
    Then  add product to cart tagging request is triggered
