Feature: Search the Web
  As a human
  I want to use cucumber
  So I can be cool

  @watch
  Scenario Outline: Search for Xolv.io
    Given I have visited the index page
    When I enter <text>
    Then I see <result>

  Examples:
  	| text   | result        |
  	| Joe    | Hello Joe!    |
  	| John   | Hello John!   |
  	| Claire | Hello Claire! |