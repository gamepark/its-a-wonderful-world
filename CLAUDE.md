# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an implementation of the board game "It's a Wonderful World" for Game Park (https://game-park.com/). The project is structured as a Yarn workspace monorepo with two main packages:

- **rules**: Game logic and rules engine (published as `@gamepark/its-a-wonderful-world`)
- **app**: React frontend application that renders the game UI

## Development Commands

### Starting Development
```bash
yarn start              # Start the React dev server for the app
```

### Building
```bash
yarn build              # Build the React app for production
yarn workspace @gamepark/its-a-wonderful-world run build  # Build rules package only
```

### Building Rules Package (from rules/ directory)
```bash
cd rules
yarn build              # Compile TypeScript to dist/
```

The rules package uses `prepublishOnly` script to automatically build before publishing.

### Deployment
After building the app:
```bash
rclone sync app/build its-a-wonderful-world:its-a-wonderful-world.v2.game-park.com --progress --s3-acl=public-read
```
(Requires rclone configuration - see README.md for setup instructions)

## Architecture

### Monorepo Structure
This is a **Lerna + Yarn workspaces** monorepo (v2.9.0) with two packages:

1. **rules/** - Game rules engine (ESM package)
   - Pure TypeScript game logic
   - Published to npm as `@gamepark/its-a-wonderful-world`
   - Built as ES Modules (`"type": "module"`)
   - Depends on `@gamepark/rules-api` peer dependency

2. **app/** - React frontend
   - Uses `react-app-rewired` for custom webpack configuration
   - References rules package via TypeScript path mapping (`@gamepark/its-a-wonderful-world/*`)
   - Uses `@emotion/react` for styling with JSX pragma

### Rules Package Architecture

The rules package follows the Game Park rules-api framework pattern:

- **ItsAWonderfulWorld.ts**: Main rules class implementing `Rules`, `SecretInformation`, `Undo`, `Competitive`, `Eliminations`, and `TimeLimit` interfaces from `@gamepark/rules-api`
- **GameState.ts / GameView.ts**: Full state vs. player-specific view (hides secret information like opponent hands)
- **Player.ts / PlayerView.ts**: Player state with hidden hand information
- **moves/**: Move types and execution logic (e.g., `ChooseDevelopmentCard`, `PlaceResource`, `CompleteConstruction`)
- **material/**: Game entities (Developments, Resources, Empires, Characters)
- **Phase.ts**: Game phases (Draft, Planning, Production)

Key concepts:
- The game uses a **card drafting** mechanic (7 cards per round, 4 rounds)
- Players build **developments** by placing **resources** (Materials, Energy, Science, Gold, Exploration)
- **Automatic moves** are calculated when certain conditions are met (e.g., completing construction when all cost spaces filled)
- The rules engine returns **move views** that hide secret information from opponents

### App Package Architecture

React app structure:
- **index.tsx**: Entry point using `GameProvider` from `@gamepark/react-client`
- **App.tsx**: Main app component
- **GameDisplay.tsx**: Game board rendering
- **material/**: React components for game pieces
  - **board/**: Board components (ResourceArea, RoundTracker, PhaseIndicator)
  - **developments/**: Development card components
  - **empires/**: Empire card components
  - **characters/**: Character token components
  - **resources/**: Resource cube components
- **Animations.ts**: Animation configuration for game actions
- **ItsAWonderfulWorldView.ts**: View layer that connects rules to UI
- **tutorial/**: Tutorial mode with AI worker

### Key Technical Details

#### TypeScript Configuration
- Root `tsconfig.json` has strict mode enabled (`noImplicitAny`, `strictNullChecks`, etc.)
- Rules package outputs ES Modules with declarations
- App uses path mapping to reference rules package source directly during development (not the built package)

#### Webpack Customization (app/config-overrides.js)
- Uses `react-app-rewired` with `customize-cra`
- Configures `comlink-loader` for Web Workers (used for tutorial AI: `*.worker.ts` files)
- Adds `imagemin-webp-webpack-plugin` for image optimization
- Applies TypeScript path aliases from `tsconfig.paths.json`

#### Path Mapping
The app's `tsconfig.paths.json` maps `@gamepark/its-a-wonderful-world/*` to `../rules/src/*`, allowing the app to import rules package source directly:
```typescript
import Rules from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
```

This enables development without rebuilding the rules package after every change.

#### Web Workers
Tutorial AI runs in a Web Worker (`tutorial/TutorialAI.worker.ts`) to avoid blocking the main thread. The worker is loaded using `comlink-loader`.

## Important Notes

### Rules Package Publishing
- The rules package is published as an ESM-only package (`"type": "module"`)
- It requires peer dependencies: `@gamepark/rules-api` (>=5.23) and `lodash` (>=4.17)
- Build before publishing: `yarn build` (or `prepublishOnly` runs automatically)

### Legacy OpenSSL Flag
The app's start and build scripts use `--openssl-legacy-provider` flag for compatibility with older Node.js crypto implementations. This may not be needed with newer Node.js versions.

### No Translation Crashes
Recent commit mentions preventing Google Translate from crashing React (see commit 3280f36). The codebase uses `i18next` for internationalization.

### Strict TypeScript
The codebase has very strict TypeScript settings enabled. Ensure all code passes these checks:
- No implicit any
- No unused locals/parameters
- Strict null checks
- No implicit returns/this

