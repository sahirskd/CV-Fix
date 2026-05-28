## Why

Currently, releasing the CV-Fix macOS desktop application requires the developer to manually run `npm run tauri build`, generate the `.dmg` file locally, and manually upload it to GitHub Releases. Automating this process via GitHub Actions will save time, reduce human error, and provide users with readily available artifacts directly tied to version tags.

## What Changes

- Add a GitHub Actions workflow file (`.github/workflows/release.yml`) to automatically build and upload the `.dmg` installer when a new tag (e.g., `v*`) is pushed to the repository.
- Use `tauri-apps/tauri-action` to handle the native macOS environment setup, Rust compilation, and binary bundling.

## Capabilities

### New Capabilities
- `github-actions-release`: Automation of the Tauri macOS build and release pipeline.

### Modified Capabilities

## Impact

- No direct codebase impact on the React/Rust source.
- Substantially improves the project's CI/CD pipeline.
- Modifies `.github/workflows` to run on macOS runners, potentially consuming GitHub Actions minutes.
