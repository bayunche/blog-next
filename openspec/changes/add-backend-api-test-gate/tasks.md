## 1. Backend Test Foundation

- [x] 1.1 Refactor the Koa server bootstrap so the app can be instantiated in tests without automatically binding a production listener.
- [x] 1.2 Add backend test tooling, scripts, fixtures, and shared helpers for database state, auth setup, and external-service mocking.

## 2. Route Coverage

- [x] 2.1 Add contract/integration tests for public content, taxonomy, auth, and protected management endpoints.
- [x] 2.2 Add tests for upload-serving path safety, utility route families (`monitor`, `fragment`, `record`, `discuss`, `user`), and the music route family with controlled upstream mocks where needed.

## 3. Packaging Gate

- [x] 3.1 Update Docker packaging/export scripts so backend API tests run as a mandatory gate before distributable artifacts are emitted.
- [x] 3.2 Document the packaging test gate, expected prerequisites, and failure behavior for developers/operators.

## 4. Validation

- [x] 4.1 Run the backend API test suite locally and capture any route families that still require follow-up.
- [x] 4.2 Run the packaging flow and confirm it executes the backend test gate before producing the export bundle.

Validation completed with `npm --prefix server run test:api` and a full `./package_offline_docker.ps1` run. The offline packaging log showed the backend API gate executing first, all 15 route/upload/music tests passing, and the export bundle being emitted only after the gate succeeded.
