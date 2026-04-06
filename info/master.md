# ShellDeck Custom Terminal Executor Implementation Plan

We are pivoting the ShellDeck application to fulfill a very powerful feature: act as a GUI layer for executing backend terminal commands. Because we already have a robust Electron + React + Vite + SQLite foundational architecture, we can bypass basic setup overhead and jump straight into execution logic.

## User Review Required

> [!CAUTION]
> Giving a renderer process (the UI) the ability to execute terminal commands requires careful IPC handling. We will use `child_process.exec` strictly inside the `main` process and pass results over the bridge. Before proceeding to execution, please review this integration roadmap.

---

## Phase 1: Basic Infrastructure (The Foundation)
*Currently, our App exists as a React + Electron app. We will extend the existing Electron IPC to support command execution.*

### 🛠️ Extensibility Setup
#### [MODIFY] `src/services/electron.api.js`
- Create a new IPC Handler: `ipcMain.handle('execute-command', (event, command) => {...})` using Node's `child_process`.
- Expose this safely to the frontend via `contextBridge` in `preload.js` so React can securely dispatch strings.

---

## Phase 2: Execution Logic (The "Action")
*We will build a simple UI card representing a repeatable command.*

### 🖥️ First Button & Layout
#### [NEW] `src/pages/Commands/CommandsPage.jsx`
- Replace or sit alongside the existing `Home.jsx` to render a grid of actionable "Command Cards".
#### [NEW] `src/pages/Commands/components/CommandCard.jsx`
- Build a UI card containing a "Check Updates" button.
- Bind the `onClick` event to `window.electron.executeCommand('sudo apt update')`.

---

## Phase 3: Feedback & UX (The "View")
*We need to see standard output (`stdout`) and visually respond to command lifecycles.*

### 🟢 Status Feedback
- Mount a persistent "Terminal Log" window at the bottom of the app to stream stdout/stderr.
- Utilize the `react-hot-toast` / `SweetAlert2` framework currently in `swal.utils.js` to flash Red on Exit Code > 0, or Green on success.
- Introduce our port of `Loader.jsx` inside the button to show a spinning wheel while the bash command executes.

---

## Phase 4: Customization & Portability (The "Polish")
*Make it dynamic by storing saved commands in our new SQLite DB.*

### 🗄️ Dynamic Command Generation
- Repurpose the `ItemEditor.jsx` modal so a user can visually input a `Title` (e.g., Update System) and a `Command` (e.g., `apt update`).
- Save these user-defined actions to the SQLite database.
- Read them dynamically into the Command Grid when the app boots.
- Rely on your native desktop styling (Tailwind Dark Mode, pill toasts) to make it look built-in to the OS.

---

## Verification Plan
1. Send a simple string like `echo "Hello ShellDeck!"`.
2. Ensure the response streams back into React successfully.
3. Test a failing command (like `ls /fake/directory`) to verify error handling and toast notifications operate correctly.
