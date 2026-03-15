# Content API Specification

## Purpose
Define the backend API behavior that supplies article data, protected management operations, and uploaded asset serving for the application.

## Requirements

### Requirement: The API exposes public content retrieval endpoints
The system SHALL provide public API endpoints for article lists, article details, and archive-oriented article discovery.

#### Scenario: Retrieve article list data
- **WHEN** the frontend requests article listing data with pagination or filter parameters
- **THEN** the API returns article rows together with total-count metadata

#### Scenario: Retrieve article detail data
- **WHEN** the frontend requests a single published article by identifier
- **THEN** the API returns the article content and associated category or tag metadata

### Requirement: Protected management endpoints require authentication
The system MUST require authenticated administrator credentials before allowing protected content-management operations.

#### Scenario: Authenticated management request
- **WHEN** a request to a protected management endpoint includes a valid bearer token
- **THEN** the API allows the requested action subject to route-level behavior

#### Scenario: Unauthenticated management request
- **WHEN** a request to a protected management endpoint omits a valid bearer token
- **THEN** the API rejects the request as unauthorized

### Requirement: Uploaded assets can be served from the API domain
The system SHALL serve uploaded files through a public upload path while preventing path traversal outside the configured upload root.

#### Scenario: Serve an uploaded asset
- **WHEN** a client requests an existing file beneath `/public/uploads/`
- **THEN** the API streams the file response with an appropriate content type

#### Scenario: Reject invalid upload paths
- **WHEN** a client requests a path that resolves outside the configured upload directory
- **THEN** the API rejects the request instead of serving filesystem content
