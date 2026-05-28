## ADDED Requirements

### Requirement: GitHub Actions macOS build pipeline
The system SHALL have a GitHub Actions workflow that automatically builds the Tauri macOS application when a new version tag is pushed.

#### Scenario: Pushing a version tag
- **WHEN** a tag matching `v*` (e.g., `v1.0.0`) is pushed to the repository
- **THEN** the GitHub Action is triggered
- **THEN** the Action runs on `macos-latest`
- **THEN** it checks out the code, sets up Node, installs dependencies, and runs the `tauri-apps/tauri-action` to build the app

### Requirement: GitHub Release generation
The GitHub Actions workflow SHALL automatically create or append to a GitHub Release and upload the generated macOS binary assets (`.dmg`, `.app.tar.gz`, etc.).

#### Scenario: Successful build completion
- **WHEN** the `tauri-action` successfully completes the build
- **THEN** a GitHub Release is created based on the pushed tag
- **THEN** the macOS installation assets are attached to the release for public download
