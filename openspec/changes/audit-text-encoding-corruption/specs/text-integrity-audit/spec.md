## ADDED Requirements

### Requirement: Repository-owned source can be audited for encoding corruption
The system SHALL provide a supported audit routine that scans application-owned text source for likely mojibake, malformed literals, or comment-merged code while excluding vendor, generated, and snapshot data trees that are not authoritative application source.

#### Scenario: Run the text integrity audit before packaging or review
- **WHEN** a contributor runs the supported text integrity audit
- **THEN** the audit reports suspicious repository-owned source files that need human review without traversing excluded generated or vendor directories

#### Scenario: Audit surfaces behavior-affecting corruption
- **WHEN** a source file contains encoding corruption that merges comments into executable code or breaks human-readable literals
- **THEN** the audit flags the file so it can be repaired before deployment or bundle export
