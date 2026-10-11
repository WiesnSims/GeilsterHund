# AGENTS.md

## Project Overview
- Zero-dependency client-side vanilla JavaScript / HTML5 Canvas 2D game (`Gem Guardian`).
- No build pipeline, bundler, package manager (`package.json`), or compile step.

## Structure & Architecture
- `index.html`: Entry point, DOM HUD overlay, modal layers (start screen, upgrade cards, game over).
- `style.css`: Layout, retro/fantasy typography, responsive HUD styling, and modal animations.
- `game.js`: Monolithic game engine:
  - `SoundManager`: Web Audio API synthesizer (no external audio assets).
  - Data constants: `WEAPONS_DATA`, `UPGRADES_POOL`, `MAP_SIZE`.
  - `Game`: Core loop, camera coordinate transformations, collision detection, wave progression, state management.
  - Exposed globally as `window.gameInstance` on `DOMContentLoaded`.
- `opencode.json`: Local OpenCode provider configuration (Ollama local endpoint).

## Development & Verification
- **Run/Preview**: Open `index.html` directly in a browser or use browser preview (`tools.browser.preview({ path: "index.html" })`).
- **Testing/Linting**: No automated test suites or linters configured. Validate gameplay and UI changes by testing in the browser console and inspecting visual layout on `gameCanvas`.
- **Audio Context**: `SoundManager.init()` requires user interaction (`mousedown` / button clicks) before Web Audio context can start due to browser autoplay policies.
