## MODIFIED Requirements

### Requirement: Runtime behavior is environment-configurable
The system SHALL derive runtime endpoints and integration credentials from environment configuration rather than hard-coded deployment values, while ensuring repository-supported offline restore assets remain compatible with the backend image shipped in the same delivery bundle.

#### Scenario: Import offline SQL bundle on an existing MySQL volume
- **WHEN** an operator runs the supported manual SQL import workflow from the offline shell bundle
- **THEN** the bundle's shipped SQL/bootstrap assets restore a schema and initialized content set that satisfy the backend article model fields already required at runtime
