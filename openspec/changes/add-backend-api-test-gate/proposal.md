## Why

The backend service currently exposes a broad Koa API surface, but the repository does not have a maintained API test harness that verifies those routes before packaging. As a result, Docker image builds can succeed even when backend endpoints have regressed, route authorization has drifted, or changes to controllers/models break the contract consumed by the frontend and admin backoffice.

The requested outcome is stronger than "add a few test scripts": the repository needs a repeatable backend API validation layer and a packaging gate that refuses to produce release artifacts unless that validation passes.

## What Changes

- Introduce a backend API test suite that covers the current Koa route surface, including public content endpoints, protected management endpoints, upload-path behavior, auth-related flows, and music-adjacent API routes.
- Add shared test utilities and fixtures so endpoint tests can run against a controlled environment instead of depending on ad hoc developer machines.
- Define how external integrations and side-effect-heavy routes are handled during tests, using safe mocks/stubs where full live integration is not practical.
- Make Docker packaging run the backend API test suite before building/exporting distributable images, and fail packaging when the test gate fails.
- Update OpenSpec capability documentation so backend API verification and packaging gates become an explicit repository contract.

## Capabilities

### Modified Capabilities
- `content-api`: strengthen the API contract with executable endpoint verification for public retrieval, protected routes, and upload-serving behavior.
- `runtime-operations`: strengthen packaging/runtime operations so release packaging is blocked when backend API validation fails.

### Unchanged Capabilities
- `public-blog`: no new public-reader feature is introduced; frontend consumers only benefit from improved backend contract confidence.
- `admin-backoffice`: no new backoffice workflow is introduced, though admin-facing API calls benefit from stronger backend verification.
- MySQL schema and data model: no schema or migration change is required unless implementation later discovers missing seed/fixture support that must be proposed separately.

## Impact

- Public frontend behavior (`src/`): no direct UI change is intended, but the frontend benefits from tighter guarantees that article, taxonomy, auth, and upload endpoints behave as expected.
- Backoffice flows (`src/app/admin/`): no direct UI change is intended, but admin content-management flows benefit from verification of the protected routes they depend on.
- Backend API and auth (`server/`): directly affected. Route registration, auth middleware expectations, controller behavior, and upload-path handling will need testable entry points and stable fixtures.
- MySQL schema, seeds, and migrations: production schema is not intended to change, but test execution will need a repeatable data strategy such as ephemeral test data, isolated test database setup, or deterministic fixture seeding.
- Asset uploads, image bed integration, and music-related integrations: upload and music endpoints must be represented in the test plan. External dependencies that cannot run reliably in CI/package flows will need controlled stubs or narrower contract checks.
- Build, lint, test, Docker, and runtime behavior: directly affected. Packaging scripts and/or Docker build workflow will gain a mandatory backend API test gate before image export/distribution.
- Security and secrets handling: tests must not rely on real production credentials, mutate tracked secret files, or expose values from `openclaw.json` / `.env` in artifacts or logs.
- Rollback and observability: rollback consists of removing the test gate and test harness if needed, though that would reduce release safety. Test output/logging will become an important operational signal during packaging.
- Documentation: OpenSpec specs and packaging guidance must document that backend API validation is now a prerequisite for exportable Docker artifacts.

## Implementation Notes For Review

- "每个接口都写好测试脚本" is interpreted as covering every first-party Koa route in `server/router/`, not third-party vendor endpoints buried under `node_modules`.
- The packaging gate should fail closed: if backend API tests cannot start, cannot reach dependencies, or report failures, the offline/export packaging flow must stop rather than shipping a partial bundle.
- The current server startup model binds the port immediately in `app.js`; implementation will likely need a test-friendly app export or bootstrap split so tests can run the Koa app without spawning an uncontrolled production listener.
