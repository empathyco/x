Feature: Tagging component

  Background:
    Given a next queries API
    And   a suggestions API
    And   a related tags API
    And   a recommendations API with a known response
    And   a results API with a known response
    Given a URL with query parameter "lego"

  Scenario: 1. Navigating to a URL with a query triggers the query tagging.
    Then  query tagging request is triggered

  Scenario: 2. Clicking a result triggers the result click tagging.
    Then query tagging request is triggered
    Given click the first result
    Then result click tagging request is triggered
