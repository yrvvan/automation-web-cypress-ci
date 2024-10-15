Feature: Example test with Cucumber

    Scenario: PLYGRND-1 Visit the Example Cypress Site
        Given I visit the base URL
        When I click on the link with text "type"
        Then I should see the URL include "/commands/actions"
        And I should type an email "test@example.com" in the email field
