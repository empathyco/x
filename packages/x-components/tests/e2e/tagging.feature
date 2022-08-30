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
    And   "lego" is searched
    Then  query tagging request should be triggered

  Scenario: 3. Clicking a result triggers both the query and result click tagging.
    Given a results API with a known response
    And   no special config for layout view
    When  start button is clicked
    And   "lego" is searched
    And   first result is clicked
    Then  url matches "/products/"
    And   query tagging request is triggered
    And   result click tagging request is triggered
    And   result click tagging includes location "results"

  Scenario: 4. Clicking a promoted triggers the query tagging
    Given a results API with a promoted
    And   no special config for layout view
    When  start button is clicked
    And   "lego" is searched
    And   first promoted is clicked
    Then  url matches "/promoted/"
    And   query tagging request is triggered

  Scenario: 5. Clicking a banner triggers the query tagging
    Given a results API with a banner
    And   no special config for layout view
    When  start button is clicked
    And   "lego" is searched
    And   first banner is clicked
    Then  url matches "/banner/"
    And   query tagging request is triggered

  Scenario: 6. A redirection triggers query tagging
    Given a results API with a redirection
    And   no special config for layout view
    When  start button is clicked
    And   "lego" is searched
    And   first redirection is clicked
    Then  url matches "/redirection/"
    And   query tagging request is triggered

  Scenario: 7. Infinite scrolling triggers query tagging
    Given a results API with 2 pages
    And   no special config for layout view
    When  start button is clicked
    And   "lego" is searched
    Then  results page number 1 is loaded
    When  scrolls down to next page
    Then  results page number 2 is loaded
    And   query tagging request is triggered
    And   second page query tagging request is triggered

  Scenario: 8. Tracking PDP add to cart
    Given a results API with a known response
    And   no special config for layout view
    When  start button is clicked
    And   "lego" is searched
    And   first result is clicked
    When  pdp add to cart button is clicked
    Then  add product to cart tagging request is triggered

  # TODO: Add scenario checking tagging events when clicking addToCart in SERP
