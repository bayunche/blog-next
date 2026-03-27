## Context

The backend currently registers routes by loading every file under `server/router/` and starts listening immediately from `server/app.js`. There is no maintained API test framework in `server/package.json`, no clear test database/bootstrap contract, and no packaging step that validates the backend before building or exporting Docker images.

That creates several design requirements:

- endpoint tests need a stable way to instantiate the Koa app without coupling to a long-running production listener
- protected routes need deterministic auth setup rather than depending on manual bearer tokens
- database-backed routes need repeatable data state
- external service routes, especially music and image-related integrations, need a strategy that distinguishes internal contract verification from live third-party availability
- packaging scripts must integrate the test gate in a way that is strict enough to block bad artifacts but practical enough to run on developer machines and within Docker-oriented workflows

## Goals / Non-Goals

**Goals**

- Add an executable backend API test harness that exercises the current route surface in `server/router/`.
- Cover both positive and negative cases where they are part of the contract, especially auth-protected endpoints and upload-path rejection behavior.
- Make the packaging/export flow run backend API tests before Docker artifacts are produced.
- Keep the test harness deterministic, isolated from production credentials, and maintainable as routes evolve.

**Non-Goals**

- Redesign backend business logic or rewrite the Koa service into a different framework.
- Add end-to-end browser tests for frontend pages in this change.
- Require live third-party credentials for every package build.
- Introduce production schema changes unless a follow-up approved change is needed for testability.

## Decisions

### Decision: Split server bootstrap so tests can import the Koa app without auto-listening

The implementation should separate "create/configure app" from "start listening". Tests need an exported app instance or app factory so they can drive requests in-process. A thin production entrypoint can then keep the current runtime behavior.

Why:

- route-level tests are much simpler and more reliable when they can run against an in-memory/in-process Koa app
- this avoids port-collision issues and flaky lifecycle management during test runs
- it makes the backend more maintainable for future runtime checks and smoke tests

Impacted areas:

- `server/app.js` or a new bootstrap module
- any startup-only initialization that currently assumes production listen lifecycle

### Decision: Use a dedicated API integration test stack with fixtures and controlled mocks

The backend should gain a proper test runner plus HTTP assertion tooling. Tests should hit the real Koa middleware stack, while database and external integrations are handled through deterministic fixtures and mocks/stubs where needed.

Why:

- route coverage needs more than unit tests around controllers
- auth middleware, body parsing, upload path checks, and route registration are all part of the API contract and should be exercised together
- mocks are necessary for services like music/image integrations where live dependencies would make package builds fragile or require secrets

Impacted areas:

- `server/package.json` devDependencies/scripts
- new `server/tests/` structure, fixtures, helpers, and setup files
- environment configuration for test mode

### Decision: Define endpoint coverage by route contract, not only by controller file

Each first-party route under `server/router/` should have explicit coverage in the suite. That can be one or more test files per route family, but coverage must include:

- public content retrieval
- protected management flows with authorized and unauthorized access
- auth/login-related routes
- upload-serving path validation
- monitor/fragment/discuss/record/user/category/tag/article route families
- music route family, using safe mocks for network-bound dependencies where needed

Why:

- the user asked for every interface to have test scripts
- route-based coverage maps more directly to release risk than a few broad smoke tests
- it makes omissions easier to review and maintain

### Decision: Add a strict packaging gate before Docker export/build completion

Packaging scripts should run the backend API test suite before Docker image export completes. If the tests fail, packaging must stop and return a non-zero exit code. For flows that build images first and export later, the test gate should still run before the final distributable bundle is emitted.

Why:

- the requirement is not just "tests exist", but "打包时一定要测试"
- failing late but before export still prevents shipping invalid artifacts
- packaging logs then become a trustworthy release checkpoint

Impacted areas:

- offline packaging scripts (`package_offline_docker.ps1` / `.sh`)
- possibly server/web Docker build helper scripts if they are also treated as packaging entry points
- operational documentation

### Decision: Prefer repository-local mocks over live external dependencies for package-time reliability

External integrations should not force packaging to depend on real internet connectivity or live third-party credentials unless the endpoint contract fundamentally requires it. For example, music/image routes can be validated against mocked upstream responses or controlled local adapters where feasible.

Why:

- package-time tests need to be repeatable on offline or restricted machines
- real upstream failures would create noisy false negatives unrelated to local code correctness
- this avoids leaking or requiring sensitive credentials in routine packaging flows

## Alternatives Considered

### Alternative: Add only a handful of smoke tests and call that "all interfaces tested"

Rejected because it does not satisfy the stated requirement. A small smoke suite might prove the server starts, but it would not verify every route family or protected/negative-path behavior.

### Alternative: Run tests only after Docker images are built, but still export the bundle on failure

Rejected because that weakens the gate. The whole point is to stop packaging when backend API verification fails.

### Alternative: Use live MySQL, music, and image-bed services for all package-time tests

Rejected because it makes packaging too brittle and secret-dependent. The suite needs to isolate external risk while still validating local contract behavior.

## Risks / Trade-offs

- [Legacy server structure] The Koa service may not currently separate initialization concerns cleanly. Mitigation: introduce the smallest bootstrap split necessary to make the app importable in tests.
- [Fixture complexity] Covering every route family will require more setup than a simple smoke test. Mitigation: centralize fixtures/helpers so each new route test does not reinvent auth, DB, or mock setup.
- [External dependency ambiguity] Some routes may blend local logic and upstream calls in ways that are hard to isolate. Mitigation: define route-by-route whether to use mocked upstreams, narrowed contract assertions, or explicit exclusions that must be documented and approved.
- [Packaging runtime cost] Running the full backend suite before export will slow packaging. Mitigation: keep fixtures lean, parallelize where safe, and separate fast local mocks from heavier integration setup.
- [Worktree overlap] The repository already contains active user changes. Mitigation: keep the change scoped, avoid reverting unrelated work, and document any assumptions before implementation.

## Migration Plan

1. Introduce a test-friendly server bootstrap/app factory.
2. Add backend test tooling, shared fixtures, and environment setup.
3. Implement route-family tests until the first-party Koa route surface is covered.
4. Wire the backend API suite into packaging/export scripts as a mandatory gate.
5. Document the new testing and packaging expectations, then run targeted validation.

Rollback strategy:

- Remove the packaging gate from export scripts.
- Remove the new test harness and restore the old startup structure if absolutely necessary.
- No production data or deployment rollback is required because the change is about testability and release gating.

## Cross-System Impact Review

- Public frontend (`src/`): no direct implementation change expected; improved backend confidence is the primary benefit.
- Backoffice (`src/app/admin/`): no direct implementation change expected; protected admin API calls gain stronger verification.
- Backend API (`server/`): directly affected through bootstrap refactor, test harness, mocks, and route coverage.
- MySQL/data: test setup will need an isolated strategy, but production schema/runtime behavior should remain unchanged.
- Uploads/media/image bed/music integrations: route coverage must include these boundaries, likely with controlled stubs for package-time reliability.
- Build/test/runtime/Docker: directly affected because packaging/export workflows become test-gated.
- Security/secrets: test mode must avoid real credentials and must not rewrite tracked secret-like files.
- Observability/docs: package logs and documentation become part of the release safety model.
