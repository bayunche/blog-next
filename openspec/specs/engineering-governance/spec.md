# engineering-governance Specification

## Purpose
Define the repository-wide change governance process that requires OpenSpec planning and user review before implementation work begins.

## Requirements
### Requirement: Repository changes require an OpenSpec change package
The repository MUST require an OpenSpec change package before modifying application code, backend code, database schema, dependencies, environment configuration, or deployment assets.

#### Scenario: Start a new implementation request
- **WHEN** a contributor or AI agent is asked to make a repository change
- **THEN** it creates or updates `openspec/changes/<change-name>/proposal.md`, delta specs, `design.md`, and `tasks.md` before editing implementation files

#### Scenario: No approved change exists
- **WHEN** no reviewed OpenSpec change package exists for the requested work
- **THEN** the agent limits edits to planning artifacts and does not modify implementation files

### Requirement: Proposals must evaluate system-wide impact
Every OpenSpec proposal and design MUST evaluate the change from a system-wide architecture perspective rather than as isolated file edits.

#### Scenario: Draft a proposal for a scoped feature
- **WHEN** a proposal is created
- **THEN** it identifies affected or intentionally unaffected domains across frontend, backoffice, backend API, database, deployment, security, observability, documentation, and validation

#### Scenario: Draft a design for a cross-cutting change
- **WHEN** a design is created
- **THEN** it records alternatives considered, migration or rollback implications, and operational risks

### Requirement: User review gates implementation
The repository MUST require explicit user review of the OpenSpec change package before implementation begins.

#### Scenario: Proposal under review
- **WHEN** the user is still reviewing or revising proposal artifacts
- **THEN** the agent does not move into code implementation

#### Scenario: Scope changes during implementation
- **WHEN** implementation reveals a meaningful scope change or blast-radius change
- **THEN** the agent updates the OpenSpec artifacts and asks for review again before continuing
