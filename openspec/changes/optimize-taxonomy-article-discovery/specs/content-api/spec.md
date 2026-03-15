## MODIFIED Requirements

### Requirement: The API exposes public content retrieval endpoints
The system SHALL provide public API endpoints for article lists, article details, archive-oriented article discovery, and explicit taxonomy discovery data for public tag and category browsing.

#### Scenario: Retrieve public tag discovery data
- **WHEN** the frontend requests a public tag page by tag name
- **THEN** the API returns the canonical tag identity, paginated published article rows, total-count metadata, and related taxonomy suggestions derived from published content

#### Scenario: Retrieve public category discovery data
- **WHEN** the frontend requests a public category page by category name, including the uncategorized view
- **THEN** the API returns the canonical category identity, paginated published article rows for that category or uncategorized published articles when requested, total-count metadata, and related taxonomy suggestions derived from published content

#### Scenario: Retrieve public taxonomy summaries
- **WHEN** the frontend requests category or tag summary data for public navigation surfaces
- **THEN** the API returns normalized, deduplicated taxonomy counts derived only from published articles without regressing the management-facing taxonomy list contract
