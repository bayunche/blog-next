## MODIFIED Requirements

### Requirement: The platform runs as separate frontend and backend services
The system SHALL run the public web application and the Koa API as separate runtime concerns connected through environment-driven routing, while keeping the production frontend service buildable after approved backoffice changes are added to the shared Next.js application.

#### Scenario: Build the production frontend service image
- **WHEN** deployment builds the production `web` service image with approved backoffice code included in the shared Next.js app
- **THEN** the frontend bundle compiles successfully instead of failing on admin-only TypeScript regressions that block image creation

#### Scenario: Start the production backend service image
- **WHEN** deployment starts the production `server` service image with approved API code included
- **THEN** the Koa process boots successfully instead of crashing during controller module loading because of syntax-corrupted source text

#### Scenario: Refresh the existing offline shell bundle after a validated production image rebuild
- **WHEN** operators rely on the checked-in `dist/offline-bundle-sh-latest` delivery directory after an approved production image fix
- **THEN** the bundle's image archive is refreshed to carry the rebuilt production image set instead of a stale pre-fix image tar

#### Scenario: Manually import the shipped SQL dump after deployment
- **WHEN** operators need to re-import the delivered SQL dump after MySQL has already been initialized
- **THEN** the `dist/offline-bundle-sh-latest` bundle provides a supported helper script that imports the shipped dump into the running MySQL service without requiring operators to reconstruct the full container command by hand
