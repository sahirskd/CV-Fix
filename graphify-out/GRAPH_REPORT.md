# Graph Report - .  (2026-05-28)

## Corpus Check
- 72 files · ~64,433 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 653 nodes · 881 edges · 86 communities (85 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Tauri ACL Manifests|Tauri ACL Manifests]]
- [[_COMMUNITY_React App Architecture|React App Architecture]]
- [[_COMMUNITY_NPM Dependencies|NPM Dependencies]]
- [[_COMMUNITY_Tauri ACL Commands|Tauri ACL Commands]]
- [[_COMMUNITY_Database & Services|Database & Services]]
- [[_COMMUNITY_Tauri Configuration|Tauri Configuration]]
- [[_COMMUNITY_TypeScript App Config|TypeScript App Config]]
- [[_COMMUNITY_TypeScript Node Config|TypeScript Node Config]]
- [[_COMMUNITY_Tauri Core Permissions|Tauri Core Permissions]]
- [[_COMMUNITY_Tauri ACL Deny Rules|Tauri ACL Deny Rules]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 81|Community 81]]

## God Nodes (most connected - your core abstractions)
1. `allow` - 76 edges
2. `deny` - 76 edges
3. `permissions` - 31 edges
4. `permissions` - 30 edges
5. `compilerOptions` - 17 edges
6. `useAppContext()` - 17 edges
7. `compilerOptions` - 16 edges
8. `permissions` - 11 edges
9. `permissions` - 9 edges
10. `definitions` - 8 edges

## Surprising Connections (you probably didn't know these)
- `MobileTabs()` --calls--> `useAppContext()`  [EXTRACTED]
  src/components/layout/MobileTabs.tsx → src/context/AppContext.tsx
- `Header()` --calls--> `useAppContext()`  [EXTRACTED]
  src/components/layout/Header.tsx → src/context/AppContext.tsx
- `SettingsModal()` --calls--> `useAppContext()`  [EXTRACTED]
  src/components/modals/SettingsModal.tsx → src/context/AppContext.tsx
- `MatchDashboard()` --calls--> `useAppContext()`  [EXTRACTED]
  src/components/job/MatchDashboard.tsx → src/context/AppContext.tsx
- `JobIngestionCard()` --calls--> `useAppContext()`  [EXTRACTED]
  src/components/job/JobIngestionCard.tsx → src/context/AppContext.tsx

## Communities (86 total, 1 thin omitted)

### Community 0 - "Tauri ACL Manifests"
Cohesion: 0.05
Nodes (44): commands, description, identifier, commands, description, identifier, commands, description (+36 more)

### Community 1 - "React App Architecture"
Cohesion: 0.11
Nodes (23): AppContext, AppProvider(), useAppContext(), MasterCVEditor(), WorkspacePreview(), useAppSettings(), useLayoutResize(), useTheme() (+15 more)

### Community 2 - "NPM Dependencies"
Cohesion: 0.05
Nodes (36): dependencies, @anthropic-ai/sdk, @google/generative-ai, idb-keyval, lucide-react, @monaco-editor/react, react, react-dom (+28 more)

### Community 3 - "Tauri ACL Commands"
Cohesion: 0.06
Nodes (33): commands, description, identifier, commands, description, identifier, commands, description (+25 more)

### Community 4 - "Database & Services"
Cohesion: 0.14
Nodes (22): AppContextType, addHistoryRecord(), getApiKey(), getHistory(), getMasterLatex(), getPromptTweak(), getSelectedModel(), saveApiKey() (+14 more)

### Community 5 - "Tauri Configuration"
Cohesion: 0.10
Nodes (19): debugApplicationIdSuffix, app, security, windows, build, beforeBuildCommand, beforeDevCommand, devUrl (+11 more)

### Community 6 - "TypeScript App Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 7 - "TypeScript Node Config"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 8 - "Tauri Core Permissions"
Cohesion: 0.19
Nodes (16): core, default_permission, default_permission, core:event, default_permission, global_scope_schema, permission_sets, global_scope_schema (+8 more)

### Community 9 - "Tauri ACL Deny Rules"
Cohesion: 0.10
Nodes (16): commands, description, identifier, commands, description, identifier, commands, description (+8 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (15): definitions, Identifier, Number, PermissionEntry, Target, Value, oneOf, anyOf (+7 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (13): definitions, Number, PermissionEntry, Target, Value, anyOf, description, anyOf (+5 more)

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (11): description, properties, required, type, Capability, description, type, identifier (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.20
Nodes (10): $ref, description, items, type, uniqueItems, description, items, type (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.20
Nodes (10): type, webviews, windows, items, description, items, type, description (+2 more)

### Community 15 - "Community 15"
Cohesion: 0.20
Nodes (10): $ref, description, items, type, uniqueItems, description, items, type (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.20
Nodes (10): type, webviews, windows, items, description, items, type, description (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.22
Nodes (9): commands, description, identifier, allow, commands, description, identifier, allow-app-show (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.22
Nodes (9): commands, description, identifier, deny, commands, description, identifier, allow-app-hide (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.22
Nodes (9): properties, Identifier, description, oneOf, type, identifier, remote, anyOf (+1 more)

### Community 20 - "Community 20"
Cohesion: 0.21
Nodes (8): commands, description, identifier, commands, description, identifier, allow-popup, allow-set-as-help-menu-for-nsapp

### Community 21 - "Community 21"
Cohesion: 0.25
Nodes (8): core:app, global_scope_schema, permission_sets, permissions, commands, description, identifier, deny-register-listener

### Community 22 - "Community 22"
Cohesion: 0.25
Nodes (8): description, properties, required, type, CapabilityRemote, urls, description, type

### Community 23 - "Community 23"
Cohesion: 0.25
Nodes (8): description, properties, required, type, CapabilityRemote, urls, description, type

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (6): default, description, identifier, local, permissions, windows

### Community 25 - "Community 25"
Cohesion: 0.33
Nodes (5): description, identifier, permissions, $schema, windows

### Community 26 - "Community 26"
Cohesion: 0.40
Nodes (5): commands, description, identifier, permissions, allow-is-checked

### Community 27 - "Community 27"
Cohesion: 0.40
Nodes (4): anyOf, description, $schema, title

### Community 28 - "Community 28"
Cohesion: 0.40
Nodes (4): anyOf, description, $schema, title

### Community 29 - "Community 29"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-fetch-data-store-identifiers

### Community 30 - "Community 30"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-name

### Community 31 - "Community 31"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-register-listener

### Community 32 - "Community 32"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-remove-listener

### Community 33 - "Community 33"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-tauri-version

### Community 34 - "Community 34"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-remove-listener

### Community 35 - "Community 35"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-version

### Community 36 - "Community 36"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-bundle-type

### Community 37 - "Community 37"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-default-window-icon

### Community 38 - "Community 38"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-identifier

### Community 39 - "Community 39"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-remove-data-store

### Community 40 - "Community 40"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-set-app-theme

### Community 41 - "Community 41"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-set-dock-visibility

### Community 42 - "Community 42"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-supports-multiple-windows

### Community 43 - "Community 43"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-version

### Community 44 - "Community 44"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-app-hide

### Community 45 - "Community 45"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-app-show

### Community 46 - "Community 46"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-bundle-type

### Community 47 - "Community 47"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-default-window-icon

### Community 48 - "Community 48"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-identifier

### Community 49 - "Community 49"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-name

### Community 50 - "Community 50"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-remove-data-store

### Community 51 - "Community 51"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-set-app-theme

### Community 52 - "Community 52"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-set-dock-visibility

### Community 53 - "Community 53"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-supports-multiple-windows

### Community 54 - "Community 54"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-create-default

### Community 55 - "Community 55"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-set-accelerator

### Community 56 - "Community 56"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-append

### Community 57 - "Community 57"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-get

### Community 58 - "Community 58"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-insert

### Community 59 - "Community 59"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-items

### Community 60 - "Community 60"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-prepend

### Community 61 - "Community 61"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-remove

### Community 62 - "Community 62"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-remove-at

### Community 63 - "Community 63"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-set-as-app-menu

### Community 64 - "Community 64"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-set-as-window-menu

### Community 65 - "Community 65"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-set-as-windows-menu-for-nsapp

### Community 66 - "Community 66"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-set-checked

### Community 67 - "Community 67"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-set-enabled

### Community 68 - "Community 68"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-set-icon

### Community 69 - "Community 69"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-set-text

### Community 70 - "Community 70"
Cohesion: 0.50
Nodes (4): commands, description, identifier, allow-text

### Community 71 - "Community 71"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-append

### Community 72 - "Community 72"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-insert

### Community 73 - "Community 73"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-is-checked

### Community 74 - "Community 74"
Cohesion: 0.50
Nodes (4): commands, description, identifier, deny-items

### Community 75 - "Community 75"
Cohesion: 0.50
Nodes (4): description, required, type, Capability

### Community 76 - "Community 76"
Cohesion: 0.50
Nodes (4): default, description, type, local

### Community 77 - "Community 77"
Cohesion: 0.50
Nodes (4): default, description, type, description

### Community 78 - "Community 78"
Cohesion: 0.50
Nodes (4): default, description, type, local

### Community 79 - "Community 79"
Cohesion: 0.50
Nodes (4): default, description, type, description

## Knowledge Gaps
- **335 isolated node(s):** `tsBuildInfoFile`, `target`, `lib`, `module`, `types` (+330 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `allow` connect `Community 17` to `Tauri ACL Manifests`, `Tauri ACL Commands`, `Tauri ACL Deny Rules`, `Community 18`, `Community 20`, `Community 21`, `Community 26`, `Community 29`, `Community 30`, `Community 31`, `Community 32`, `Community 33`, `Community 34`, `Community 35`, `Community 36`, `Community 37`, `Community 38`, `Community 39`, `Community 40`, `Community 41`, `Community 42`, `Community 43`, `Community 44`, `Community 45`, `Community 46`, `Community 47`, `Community 48`, `Community 49`, `Community 50`, `Community 51`, `Community 52`, `Community 53`, `Community 54`, `Community 55`, `Community 56`, `Community 57`, `Community 58`, `Community 59`, `Community 60`, `Community 61`, `Community 62`, `Community 63`, `Community 64`, `Community 65`, `Community 66`, `Community 67`, `Community 68`, `Community 69`, `Community 70`, `Community 71`, `Community 72`, `Community 73`, `Community 74`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `deny` connect `Community 18` to `Tauri ACL Manifests`, `Tauri ACL Commands`, `Tauri ACL Deny Rules`, `Community 17`, `Community 20`, `Community 21`, `Community 26`, `Community 29`, `Community 30`, `Community 31`, `Community 32`, `Community 33`, `Community 34`, `Community 35`, `Community 36`, `Community 37`, `Community 38`, `Community 39`, `Community 40`, `Community 41`, `Community 42`, `Community 43`, `Community 44`, `Community 45`, `Community 46`, `Community 47`, `Community 48`, `Community 49`, `Community 50`, `Community 51`, `Community 52`, `Community 53`, `Community 54`, `Community 55`, `Community 56`, `Community 57`, `Community 58`, `Community 59`, `Community 60`, `Community 61`, `Community 62`, `Community 63`, `Community 64`, `Community 65`, `Community 66`, `Community 67`, `Community 68`, `Community 69`, `Community 70`, `Community 71`, `Community 72`, `Community 73`, `Community 74`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `permissions` connect `Community 26` to `Tauri ACL Manifests`, `Tauri Core Permissions`, `Tauri ACL Deny Rules`, `Community 20`, `Community 54`, `Community 55`, `Community 56`, `Community 57`, `Community 58`, `Community 59`, `Community 60`, `Community 61`, `Community 62`, `Community 63`, `Community 64`, `Community 65`, `Community 66`, `Community 67`, `Community 68`, `Community 69`, `Community 70`, `Community 71`, `Community 72`, `Community 73`, `Community 74`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `tsBuildInfoFile`, `target`, `lib` to the rest of the system?**
  _335 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Tauri ACL Manifests` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `React App Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.11379800853485064 - nodes in this community are weakly interconnected._
- **Should `NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._