## ADDED Requirements

### Requirement: Runtime delivery provides a canonical production entrypoint
The repository SHALL provide one canonical production delivery workflow that can build runtime images, start the production compose stack, and export the built production images without requiring operators to choose between divergent script implementations.

#### Scenario: Choose the execution branch interactively with no flags
- **WHEN** an operator runs the canonical delivery script without any flags
- **THEN** the script presents an interactive selection flow so the operator can choose the target environment and whether to start services or export images after the build

#### Scenario: Keep explicit flags non-interactive
- **WHEN** an operator supplies explicit flags to the canonical delivery script
- **THEN** the script executes the requested branch directly without entering the interactive selection flow

#### Scenario: Build and start the production stack
- **WHEN** an operator runs the canonical production delivery workflow in deploy mode
- **THEN** the workflow uses the production env file and production compose overlay, builds the required runtime images, and starts the production services

#### Scenario: Build production images for export without starting services
- **WHEN** an operator runs the canonical production delivery workflow in export-oriented or build-only mode
- **THEN** the workflow builds the same production runtime images and can export them without starting the production services

### Requirement: Runtime image identity is explicit across delivery workflows
The repository SHALL define stable Docker image references for locally built runtime services so deployment, export, and compatible secondary packaging workflows resolve the same images.

#### Scenario: Resolve images after a compose build
- **WHEN** a delivery workflow tags, saves, or exports runtime images after a compose-managed build
- **THEN** it resolves explicit repository-defined image names instead of relying on container names or implicit compose project naming

#### Scenario: Reuse the same images in a secondary workflow
- **WHEN** a compatible secondary workflow such as offline packaging consumes the built runtime images
- **THEN** it reuses the same explicit image references rather than maintaining a conflicting naming convention
