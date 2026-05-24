# 🛠️ CV-Fix — Neubrutalist LaTeX Resume Optimization Hub

> **CV-Fix** is an advanced, high-precision resume tailoring command center. It empowers developers and technical professionals to dynamically optimize their **Master LaTeX Resumes** against target job descriptions in real-time. Built with a stunning neubrutalist aesthetic, CV-Fix provides direct client-side AI analysis, live A4 facsimile previews, and native keyless local LLM integrations.

Available as a highly responsive **Progressive Web App (PWA)** and a high-performance **Tauri v2 Desktop Application**.

---

## 🏛️ System Architecture & Data Flow

CV-Fix operates as a completely serverless, client-first application. All sensitive information (resumes, job descriptions, history, and API credentials) is cached locally in the browser or WebView.

```
                    ┌──────────────────────────────────────────────┐
                    │               React 19 Frontend              │
                    │   ┌───────────────┐      ┌───────────────┐   │
                    │   │ Monaco Editor │      │  A4 Facsimile │   │
                    │   │ (LaTeX Code)  │      │  HTML Preview │   │
                    │   └───────────────┘      └───────────────┘   │
                    └───────────────────────┬──────────────────────┘
                                            │
                             IPC / Fetch    │
                                            ▼
     ┌────────────────────────────────────────────────────────────────────────────┐
     │                             Orchestrator Service                           │
     │ ┌────────────────────────┐ ┌────────────────────────┐ ┌──────────────────┐ │
     │ │   Gemini / Claude API  │ │   Direct Web Scraper   │ │  Local CLI Mode  │ │
     │ │ (Generative Web API)  │ │ (Lever/Ashby/Greenhouse)│ │  (System Path)   │ │
     │ └────────────────────────┘ └────────────────────────┘ └──────────────────┘ │
     └──────────────────────────────────────────────────────────────────────┬─────┘
                                                                            │
                                                                   IPC      │ (Desktop Only)
                                                                            ▼
                                                     ┌────────────────────────────────────────────┐
                                                     │              Tauri v2 Backend              │
                                                     │    ┌──────────────────────────────────┐    │
                                                     │    │            Rust Core             │    │
                                                     │    │   - check_gemini_cli_status()    │    │
                                                     │    │   - run_gemini_cli()             │    │
                                                     │    └────────────────┬─────────────────┘    │
                                                     └─────────────────────┼──────────────────────┘
                                                                           │ Spawns
                                                                           ▼
                                                             ┌────────────────────────────┐
                                                             │     Local Gemini CLI       │
                                                             │   (Keyless Local LLM)      │
                                                             └────────────────────────────┘
```

### Key Technical Pillars:
1. **Frontend Architecture:** React 19 + TypeScript + Vite. Uses `@monaco-editor/react` to provide syntax highlighting for LaTeX and `lucide-react` for iconography.
2. **Neubrutalist Styling:** Curated neubrutalist UI design built on Tailwind CSS v4 (`@tailwindcss/vite`) utilizing dynamic HSL tokens, thick borders, responsive column resizers, and strict print stylesheets.
3. **Parsing Engine:** A custom high-fidelity client-side LaTeX-to-HTML parser (`latexRenderer.ts`) that extracts standard CV sections, contact elements, bulleted list environments, and compiles them instantly into a standard A4 paper facsimile.
4. **Local Storage:** Client-side local persistence using IndexedDB (via `idb-keyval` wrapper) for storing master resumes, API credentials, and optimization histories.
5. **Native IPC Wrapper (Tauri v2):** A lightweight Rust shell (`src-tauri`) that exposes native IPC commands to bridge the React UI with the host filesystem and environment, bypassing browser CORS restrictions and running native terminal executables.

---

## ✨ Features

- 📑 **Master LaTeX Registry:** Standalone, browser-persisted LaTeX code editor with live syntax highlighting and templates.
- 🎯 **Target Job Ingestion:** Automatic, client-side web scraper compatible with major applicant tracking boards (Ashby, Greenhouse, Lever, LinkedIn), alongside plain unstructured copy-paste fallbacks.
- 🧬 **LaTeX Mutation Engine:** Employs precise, low-temperature prompt constraints that rewrite experience blocks, bullet arrays, and summaries while preserving the compilation-safe LaTeX syntax perfectly intact.
- 📊 **10-Dimension Scorecard:** Aggregates a weighted rating (Hard skills, Metrics, Gaps, Verbs, Layout, Keywords) mapping to an interactive A-F grade dashboard.
- 📝 **Recruiter Assessments:** Generates a 6-block recruiter pipeline report including Role Mission Summaries, Seniority strategy, Salary estimation, Gaps analysis, and STAR interview outlines.
- 🖨️ **High-Fidelity PDF Printing:** Built-in CSS `@media print` rules let you compile and download structured PDF files instantly using system print dialogue sheets.
- 🔌 **Dual Optimization Models:** Directly integrates client-side Web APIs (Gemini 2.0 / Claude 3.5) with a keyless fallback using your machine's local `gemini` CLI tool.

---

## 🛠️ Prerequisites

Before building or running the application, make sure your system has the following installed:

### 1. For Web & PWA Development
- **Node.js:** v18.0.0 or higher (v24+ recommended).
- **npm:** v9.0.0 or higher (v11+ recommended).

### 2. For Desktop Development (Tauri v2)
- **Rust Compiler & Cargo:** Installation via `rustup` is recommended. Requires Rust v1.77.2 or higher.
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```
- **macOS System Tools:** Xcode Command Line Tools.
  ```bash
  xcode-select --install
  ```

### 3. (Optional) For Local Keyless LLM Mode
- **Gemini CLI:** The local terminal assistant.
- **Node Environment PATH:** Make sure Node bin is added to your terminal path so Tauri can locate it.

---

## 🚀 Running the Application

### 1. Web Version (PWA)

To run the web application locally inside a standard browser:

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev

# 3. Compile and build the static web bundle
npm run build

# 4. Preview the compiled production build
npm run preview
```

The web version will run on `http://localhost:5173/`. Build assets will compile into `/dist` and are ready for standard static hosting (Vercel, Netlify, Github Pages).

---

### 2. Desktop Version (Tauri App)

To run and compile CV-Fix as a native macOS desktop application:

```bash
# 1. Install packages and set up native bindings
npm install

# 2. Run the application in desktop dev mode
# This launches the Rust compiler, binds to Vite, and boots the native window
npm run tauri dev

# 3. Compile the production bundles (.app and .dmg packages)
npm run tauri build
```

#### Production Build Artifacts:
Compiled packages will be saved to:
* **macOS Standalone App:** `src-tauri/target/release/bundle/macos/CV-Fix.app`
* **macOS DMG Installer:** `src-tauri/target/release/bundle/dmg/CV-Fix_0.1.0_aarch64.dmg`

---

## 📂 Project Structure

```
├── .github/                 # CI/CD Workflows
├── dist/                    # Compiled frontend build output
├── public/                  # Static assets & PWA manifest icons
├── src/                     # React Frontend Source Code
│   ├── assets/              # Stylesheets & font definitions
│   ├── services/            # Core business logic services
│   │   ├── db.ts            # IndexedDB API & history manager
│   │   ├── scraper.ts       # Job posting web scraper
│   │   ├── latexRenderer.ts # LaTeX-to-HTML interpreter
│   │   └── orchestrator.ts  # LLM API & Tauri IPC orchestrator
│   ├── App.tsx              # Main Workstation UI Layout (Monaco & Preview)
│   └── main.tsx             # React entrypoint
├── src-tauri/               # Tauri Native Rust Backend
│   ├── capabilities/        # Desktop system security permissions
│   ├── src/                 
│   │   ├── lib.rs           # Rust commands (Zsh launcher, environment helper)
│   │   └── main.rs          # Native desktop app entrypoint
│   ├── Cargo.toml           # Rust package configuration
│   └── tauri.conf.json      # Tauri app layout, plugins, and build hooks
├── package.json             # NPM dependencies & scripts
├── vite.config.ts           # Vite + PWA configs & local CLI server proxy
└── tsconfig.json            # Strict TypeScript settings
```

---

## 🔒 Security & Privacy

1. **No External Backends:** CV-Fix has **no** database backends. Resumes, credentials, and logs never touch external servers unless you make direct calls to OpenAI/Anthropic/Gemini endpoints.
2. **API Keys Privacy:** All API keys are saved directly into your local machine's browser sandbox (IndexedDB) and are never logged or stored.
3. **Local CLI Execution Sandbox:** Spawning the local `gemini` CLI executes inside the user's login shell shell context, inheriting the exact sandbox parameters configured on the local system.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). Contributions, improvements, and architectural suggestions are always welcome!
