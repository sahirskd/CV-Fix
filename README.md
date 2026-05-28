# 🛠️ CV-Fix — Neubrutalist LaTeX Resume Optimization Hub

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Tauri](https://img.shields.io/badge/Tauri-v2-orange?logo=tauri)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)

> **CV-Fix** is an advanced, high-precision resume tailoring command center. It empowers developers and technical professionals to dynamically optimize their **Master LaTeX Resumes** against target job descriptions in real-time. Built with a stunning neubrutalist aesthetic, CV-Fix provides direct client-side AI analysis, live A4 facsimile previews, and native keyless local LLM integrations.

Available as a highly responsive **Progressive Web App (PWA)** and a high-performance **Tauri v2 Desktop Application**.

---

## ✨ Features

- 📑 **Master LaTeX Registry:** Standalone, browser-persisted LaTeX code editor with live syntax highlighting and templates.
- 🎯 **Target Job Ingestion:** Automatic, client-side web scraper compatible with major applicant tracking boards (Ashby, Greenhouse, Lever, LinkedIn), alongside plain unstructured copy-paste fallbacks.
- 🧬 **LaTeX Mutation Engine:** Employs precise, low-temperature prompt constraints that rewrite experience blocks, bullet arrays, and summaries while preserving the compilation-safe LaTeX syntax perfectly intact.
- 💻 **Dual-Panel Mutated Workspace:** A split layout providing a live A4 HTML facsimile preview on one side and the tailored LaTeX source code on the other. 
- 📊 **10-Dimension Scorecard:** Aggregates a weighted rating (Hard skills, Metrics, Gaps, Verbs, Layout, Keywords) mapping to an interactive A-F grade dashboard.
- 📝 **Recruiter Assessments:** Generates a 6-block recruiter pipeline report including Role Mission Summaries, Seniority strategy, Salary estimation, Gaps analysis, and STAR interview outlines.
- 🖨️ **High-Fidelity PDF Printing:** Built-in CSS `@media print` rules let you compile and download structured PDF files instantly using system print dialogue sheets.

---

## 🏛️ Project Architecture

CV-Fix operates as a serverless, client-first application. Following a recent major refactor, the monolithic React application was split into a highly scalable component-driven architecture:

```
src/
├── components/          # Reusable UI Modules
│   ├── editor/          # MasterCVEditor & WorkspacePreview components
│   ├── job/             # JobIngestionCard & MatchDashboard components
│   ├── layout/          # Header & MobileTabs navigation elements
│   └── modals/          # SettingsModal for API & Model configuration
├── context/             # Global Application State Management
│   └── AppContext.tsx   # Centralized provider unifying hooks & application state
├── hooks/               # Custom React Hooks
│   ├── useAppSettings.ts# Persistent config (LaTeX, API Keys, Prompts, History)
│   ├── useLayoutResize.ts# Draggable desktop panel resizing logic
│   └── useTheme.ts      # Dark/Light mode theme toggle manager
├── types/               # Centralized TypeScript Models
│   └── index.ts         # Shared interfaces (OptimizationRecord, etc.)
├── services/            # Core business logic (DB, Scraper, Orchestrator)
├── App.tsx              # Main Layout Composer (assembles components via AppContext)
└── main.tsx             # React Entrypoint
```

---

## 🤖 Usage: AI Execution Modes

CV-Fix uniquely supports three separate Artificial Intelligence execution environments, ensuring users can optimize their resumes via web APIs or completely offline via local tools:

1. **Google Gemini 2.0 Flash (API)**: Fast, native web API support perfect for immediate optimizations. API keys are saved locally in the browser.
2. **Anthropic Claude 3.5 Sonnet (API)**: Provides deep, highly nuanced LaTeX structural optimization. Best for complex resume formatting.
3. **Keyless Local Gemini CLI (Tauri Desktop Only)**: By using the Tauri native desktop wrapper, CV-Fix can securely execute a local terminal `gemini` CLI tool on your system path. This provides a keyless, heavily sandboxed native approach to local LLM communication without exposing API keys to the browser context.

---

## 🛠️ Installation & Running

Before building or running the application, ensure you have **Node.js (v18+)** and **npm (v9+)** installed.

### 1. Standard Web Development (Vite + PWA)

To run the web application locally inside a standard browser:

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev

# 3. Compile and build the static web bundle
npm run build
```

The web version will run on `http://localhost:5173/`. Build assets will compile into `/dist` and are ready for standard static hosting (Vercel, Netlify, Github Pages).

### 2. Tauri Native Desktop Development

To run and compile CV-Fix as a native macOS/Windows desktop application, you must additionally install the **Rust Compiler (v1.77.2+)** via `rustup`. 

```bash
# 1. Install Node dependencies
npm install

# 2. Run the application in desktop dev mode (Boots the native Tauri window)
npm run tauri dev

# 3. Compile the production bundles (.app and .dmg packages for macOS)
npm run tauri build
```

Compiled packages will be saved to `src-tauri/target/release/bundle/`.

---

## 💻 Technologies Used

- **Frameworks:** React 19, TypeScript, Vite
- **Desktop Runtime:** Tauri v2 (Rust Core)
- **Styling:** Tailwind CSS v4, Neubrutalism design patterns
- **State Management:** React Context API & Custom Hooks
- **Storage:** `idb-keyval` (IndexedDB)
- **Code Editor:** `@monaco-editor/react`

---

## 🔒 Security & Privacy

- **No External Backends:** CV-Fix has **no** database backends. Resumes, credentials, and logs never touch external servers unless you make direct calls to OpenAI/Anthropic/Gemini endpoints.
- **API Keys Privacy:** All API keys are saved directly into your local machine's browser sandbox (IndexedDB) and are never logged or stored.
- **Local CLI Execution Sandbox:** Spawning the local `gemini` CLI executes inside the user's login shell context, inheriting the exact sandbox parameters configured on the local system.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). Contributions, improvements, and architectural suggestions are always welcome!
