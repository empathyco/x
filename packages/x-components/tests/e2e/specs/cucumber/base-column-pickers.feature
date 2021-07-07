Feature: Base column pickers components

 Scenario Outline: 1. Column picker list and dropdown sets Recommendations and Results columns
    Given no special config for base-column-picker view
    When  "<query>" is searched
    And   <numberOfColumnsList> columns are selected from the column picker list
    Then  recommendations and results are displayed in <numberOfColumnsList> columns
    When  <numberOfColumnsDropdown> columns are selected from the column picker dropdown
    Then  recommendations and results are displayed in <numberOfColumnsDropdown> columns
    When  <numberOfColumnsList> columns are selected from the column picker list
    Then  recommendations and results are displayed in <numberOfColumnsList> columns
   Examples:
     | query | numberOfColumnsList | numberOfColumnsDropdown |
     | lego  | 2                   | 4                       |
     | lego  | 6                   | 2                       |



