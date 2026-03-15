## MODIFIED Requirements

### Requirement: Protected management endpoints require authentication
The system MUST require authenticated administrator credentials before allowing protected content-management operations, including provider-backed article-media uploads.

#### Scenario: Authenticated management media upload request
- **WHEN** a request to a protected article-media upload endpoint includes a valid administrator bearer token
- **THEN** the API allows the upload workflow subject to route-level behavior and configured storage-provider rules

#### Scenario: Unauthenticated media upload request
- **WHEN** a request to a protected article-media upload endpoint omits a valid administrator bearer token
- **THEN** the API rejects the upload as unauthorized and does not forward the file to any external media provider

## ADDED Requirements

### Requirement: Protected article-media uploads can broker external image storage
The system SHALL broker authenticated article-media uploads to the configured external image-storage provider and return canonical URLs suitable for article authoring.

#### Scenario: Upload article media to the configured external provider
- **WHEN** an authenticated administrator uploads article media while external image storage is enabled
- **THEN** the API sends the media to the configured provider using server-held credentials and returns normalized URL data for editorial use

#### Scenario: Use protected local fallback for article media
- **WHEN** external image storage is disabled or unavailable during an authenticated article-media upload and local fallback is enabled
- **THEN** the API or editor workflow can continue through the protected local upload path and produce URLs served from `/public/uploads/`
