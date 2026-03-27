## MODIFIED Requirements

### Requirement: The API exposes public content retrieval endpoints
The system SHALL provide public API endpoints for article lists, article details, and archive-oriented article discovery through backend source that preserves route registration and readable operational text where encoding defects are confirmed at the source level.

#### Scenario: Load backend route modules without swallowed handlers
- **WHEN** the backend loads article-, category-, tag-, or music-related route modules
- **THEN** encoding-corrupted comments or literals do not swallow route registrations or otherwise remove intended handlers from the router chain

#### Scenario: Surface readable operational API strings
- **WHEN** the backend returns operator-facing or user-facing status/error text from maintained routes
- **THEN** the strings remain readable instead of shipping mojibake caused by confirmed corrupted source literals
