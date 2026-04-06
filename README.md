# Electron + React + Vite Starter Project

---

This repository provides a premium starter template for building **modern desktop applications with Electron, React 19, and Vite 5**. It is styled with **Tailwind CSS v4** and set up using **Electron Forge's official Vite template**, offering a fast and efficient development experience with hot-reloading and optimized bundling.

## Features

*   **Electron 36:** Latest stable version of Electron.
*   **React 19:** Utilizing the latest features of React for UI development.
*   **Vite 5:** Next-generation frontend tooling for ultra-fast development.
*   **Tailwind CSS v4:** Modern CSS framework for rapid UI styling.
*   **Electron Forge:** Official tool for creating, building, and packaging Electron apps.
*   **Hot-Reloading:** Instant feedback on UI changes during development.
*   **Secure Preload Script:** Best practices for IPC communication.




---

## Getting Started

### Prerequisites

*   **Node.js:** Version 18.0.0 or higher.
*   **npm:** Version 9.0.0 or higher.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/PikoCanFly/electron-react-vite-starter-project
    ```

2.  **Navigate into the project directory:**
    ```bash
    cd electron-react-vite-starter-project
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

---

## Usage

### Development

To start the Electron application in development mode with HMR:

```bash
npm start
```

### Packaging

To bundle the application for your current platform:

```bash
npm run package
```

### Creating Installers

To generate platform-specific installers (e.g., .deb, .rpm, .exe, .zip):

```bash
npm run make
```

---

## Project Structure

```text
├── src/
│   ├── main.js        # Electron Main process
│   ├── preload.js     # IPC and window isolation
│   ├── renderer.jsx   # React application entry
│   ├── index.css      # Global Tailwind v4 styles
│   ├── common/        # Shared components and logic
│   └── components/    # Page-specific components
├── react-ui-ket/      # Reference UI Kit project
├── forge.config.js    # Electron Forge configuration
└── vite.*.config.mjs  # Vite configurations
```
