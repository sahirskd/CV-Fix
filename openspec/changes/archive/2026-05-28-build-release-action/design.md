## Context

We currently build the CV-Fix macOS bundle manually using `npm run tauri build`. The output is a `.dmg` installer and a `.app` bundle, which must be uploaded to GitHub manually. We want to automate this so every `v*` tag triggers a build on GitHub's macOS cloud runners, generating the `.dmg` and directly appending it to the GitHub Release.

## Goals / Non-Goals

**Goals:**
- Trigger the build pipeline automatically on push to tags matching `v*`.
- Ensure standard dependencies (Node, Rust) are correctly setup.
- Use `tauri-apps/tauri-action` to handle the heavy lifting.
- Upload the generated macOS DMG to a GitHub Release.

**Non-Goals:**
- Supporting Windows (`.exe`) or Linux builds at this current stage (can be added later).
- Code signing or notarization via Apple Developer Accounts (we will rely on basic builds).

## Decisions

- **Runner**: `macos-latest` will be used as the GitHub Action runner to guarantee compatibility with macOS compilation.
- **Node Setup**: `actions/setup-node@v4` caching npm.
- **Rust Setup**: Default Rust installed via standard toolchain (Tauri action handles most of this implicitly, but explicitly ensuring it via `rustup` is safe).
- **Tauri Action Action**: We'll use `tauri-apps/tauri-action@v0`. This action takes care of running `npm run tauri build` and directly uploads to GitHub Releases using a `GITHUB_TOKEN`.

## Risks / Trade-offs

- **Risk**: Unsigned `.dmg` files throw a macOS Gatekeeper warning ("App is damaged and can't be opened"). 
  - **Mitigation**: Users will need to right-click -> Open or run `xattr -cr /Applications/CV-Fix.app` as standard for unsigned binaries. Code signing is out of scope.
