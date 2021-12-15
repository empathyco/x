Feature: Tagging component

  Background:
    Given a next queries API
    And   a suggestions API
    And   a related tags API
    And   a recommendations API with a known response
    And   a query tagging API
    And   a click tagging API

  Scenario: 1. Navigating to a URL with a query triggers the query tagging.
    Given a results API with a known response
    And   a URL with query parameter "lego"
    Then  query tagging request should be triggered

  Scenario: 2. Searching triggers the query tagging.
    Given a results API with a known response
    And no special config for layout view
    When  start button is clicked
    And "lego" is searched
    Then  query tagging request should be triggered

  Scenario: 3. Clicking a result triggers the result click tagging.
    Given a results API with a known response
    And no special config for layout view
    When start button is clicked
    And "lego" is searched
    And first result is clicked
    Then result click tagging request is triggered
    And result click tagging includes location "results"

  Scenario: 4. Clicking a result triggers the query tagging
    Given a results API with a known response
    And no special config for layout view
    When start button is clicked
    And "lego" is searched
    And first result is clicked
    Then  query tagging request has been triggered

  Scenario: 5. Clicking a promoted triggers the query tagging
    Given a results API with a promoted
    And no special config for layout view
    When start button is clicked
    And "lego" is searched
    And first promoted is clicked
    Then query tagging request has been triggered

  Scenario: 6. Clicking a banner triggers the query tagging
    Given a results API with a banner
    And no special config for layout view
    When start button is clicked
    And "lego" is searched
    And first banner is clicked
    Then query tagging request has been triggered

  Scenario: 7. A redirection triggers query tagging
    Given a results API with a redirection
    And no special config for layout view
    When start button is clicked
    And "lego" is searched
    And first redirection is clicked
    Then query tagging request has been triggered

  Scenario: 8. Infinite scrolling triggers query tagging
    Given a results API with 2 pages
    And no special config for layout view
    When start button is clicked
    And "lego" is searched
    Then results page number 1 is loaded
    When scrolls down to next page
    Then results page number 2 is loaded
    And query tagging request has been triggered
    And second page query tagging request is triggered
