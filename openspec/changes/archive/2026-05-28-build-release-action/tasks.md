## 1. Setup GitHub Actions

- [x] 1.1 Create the `.github/workflows` directory if it does not exist
- [x] 1.2 Create the `release.yml` workflow file for the Tauri macOS build

## 2. Core Implementation

- [x] 2.1 Configure `release.yml` to trigger on pushes to `v*` tags
- [x] 2.2 Add checkout, Node setup (actions/setup-node), and dependency installation steps (`npm ci` or `npm install`)
- [x] 2.3 Add standard Rust setup steps using `dtolnay/rust-toolchain` and `Swatinem/rust-cache`
- [x] 2.4 Add `tauri-apps/tauri-action` step configured with a GitHub token for creating the release and uploading the `.dmg`

## 3. Verification

- [x] 3.1 Verify the workflow file syntax using local action linting or visual inspection
- [x] 3.2 Ensure the build script commands match those in `package.json` (`npm run build`, `npm run tauri build`)
