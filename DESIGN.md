# Blocopoly — Architectural Design

## Stack

| Concern        | Choice                                                                     |
| -------------- | -------------------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router)                                                    |
| Language       | TypeScript 5 (strict)                                                      |
| UI             | React 19 + MUI v9                                                          |
| Styling        | MUI `sx` / inline styles; Tailwind available but secondary                 |
| Runtime target | Browser (client components); server-side rendering not used for game state |

---

## Folder Structure

```
src/app/
  game/
    {domain model}/              # Each domain model has its own folder
      {subdomain}/    # Domain models can have subdomain folders if need be
    state/              # Game state management
      reducers/         # One file per action reducer
      utils.ts          # Each folder can have its own utils file if need be.
    page.tsx            # /game route — wires state to the board
  home/
    state/              # Home page state management
    page.tsx            # /home route
  setup/
    state/              # Setup page state management
    page.tsx            # /setup route — host configures game before starting
  layout.tsx
  page.tsx              # / root redirect
```

Each page folder owns its own `state/` subdirectory. Domain model files (player, property, etc.) that are shared across pages live at the nearest common ancestor — currently under `game/` for game-specific types.

The `game/` subtree owns the entire game domain. Each subdirectory maps to a single domain concept, not a technical layer (no `types/`, `utils/` catch-alls at the top level).

Each directory can have its own utils folder if found that a file has too many util methods/LOC. If certain util functions are shared across multiple domains/directories, move to a shared utils file higher up.

---

## Naming Conventions

- **Interfaces** — PascalCase, no `I` prefix. e.g. `Player`, `OwnableProperty`, `Trade`.
- **DTOs** — suffix `DTO` for serialised-over-the-wire shapes. e.g. `PlayerDTO`, `OwnablePropertyDTO`, `GameStateDTO`.
- **Config** — suffix `Config` for static, immutable board data loaded once. e.g. `OwnablePropertyConfig`.
- **View models** — the merged client-side shape drops the suffix and is the "plain" name. e.g. `Player` (= `PlayerDTO` + `PlayerConfig`), `OwnableProperty`.
- **Const enums** — `as const` objects with a companion `Value` type. e.g. `PropertyType` / `PropertyTypeValue`.
- **Files** — PascalCase for domain model files (`Player.ts`, `GameState.ts`); camelCase for utility modules (`rollDice.ts`, `utils.ts`); camelCase for board config data files (`customBoard.ts`).
- **React components** — PascalCase files, default export.
- **Stage/status strings** — `SCREAMING_SNAKE_CASE` string union types (e.g. `PlayerStage`, `Stage`).

---

## State Management

### DTO / View-Model Split

State is divided into two clearly separated layers:

| Layer             | Type                                                  | Purpose                                                                    |
| ----------------- | ----------------------------------------------------- | -------------------------------------------------------------------------- |
| **DTO**           | `GameStateDTO`, `PlayerDTO`, `OwnablePropertyDTO`     | Lean, serialisable state sent over the wire. Contains only mutable fields. |
| **Static config** | `OwnablePropertyConfig`, `PlayerConfig`, board arrays | Loaded once at session start from board config files. Never resent.        |
| **View model**    | `GameState`, `Player`, `OwnableProperty`              | Client-only merge of DTO + config. What UI components consume.             |

Hydration happens in `viewModels.ts` via `toGameStateVM` / `toPlayerVM` / `toOwnablePropertyVM`.

### Reducer Pattern

Game logic lives in `gameStateReducer` (`GameState.ts`), delegating each action to a dedicated reducer function in `state/reducers/`. One file per action. Reducers are pure functions: `(GameStateDTO, payload) → GameStateDTO`.

Actions are typed as a discriminated union in `GameStateAction.ts`.

### Immutability

All state updates use spread copies (`{ ...state, players: { ...state.players, [id]: updated } }`). No mutations in place. Helper utilities `updatePlayer` and `updateOwnedProperty` in `utils.ts` centralise this pattern.

---

## Board Config

Board layouts are static TypeScript files in `board/board_configs/`. Each file exports:

- A `(Property | OwnablePropertyConfig)[]` array (ordered by board position 0–39).
- A `Record<number, PropertyBlock>` for colour block metadata.

Grid positions (`row`, `col`) are baked into each cell to allow direct CSS Grid placement without any layout algorithm at render time.

---

## Routing

Next.js App Router. Routes so far:

| Path     | File                 | Notes                                                     |
| -------- | -------------------- | --------------------------------------------------------- |
| `/`      | `app/page.tsx`       | Root (redirect or landing)                                |
| `/home`  | `app/home/page.tsx`  | Lobby / room browser                                      |
| `/setup` | `app/setup/page.tsx` | Pre-game setup — host configures settings before starting |
| `/game`  | `app/game/page.tsx`  | Active game view                                          |

All game UI is a `"use client"` subtree.

## Documented Assumptions

1. For many reducer actions, we're assuming that the active player is making the action so pull the player Id from `state.activePlayer` instead of passing the player Id through the payload. An example of this is the action **BUY_HOUSE**. The client needs to ensure and reinforce that only the active player can perform these actions to conform to the game rules, otherwise correct state updates and behaviour are not guaranteed.
