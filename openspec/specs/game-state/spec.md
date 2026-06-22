# game-state Specification

## Purpose
TBD - created by archiving change bootstrap-mvp. Update Purpose after archive.
## Requirements
### Requirement: Game state shape

The system MUST expose a single typed `GameState` object holding `currentRound`, `maxRounds` (always 5 for MVP), `selectedRole`, `portfolio` (record of asset → weight percent), `currentEvent`, `answeredQuestions`, `scoreBoard`, `portfolioValue`, `history`, and `gameStatus`.

#### Scenario: Initial state
- **WHEN** the application boots with no saved game
- **THEN** `gameStatus` is `notStarted`, `currentRound` is `0`, `selectedRole` is `null`, and `scoreBoard` is zeroed across all 7 dimensions

#### Scenario: Mid-game state
- **WHEN** a player has finished round 2 of 5
- **THEN** `currentRound` is `2`, `history` contains 2 `RoundResult` entries, and `portfolioValue` reflects cumulative returns

### Requirement: State machine transitions

The system MUST transition `gameStatus` only along `notStarted → playing → finished`, and MUST reject any transition that skips a state.

#### Scenario: Start a new game
- **WHEN** the player confirms a role and an initial portfolio on the setup screens
- **THEN** `gameStatus` becomes `playing` and `currentRound` becomes `1`

#### Scenario: Finish a game
- **WHEN** the player completes round 5 and the final report is rendered
- **THEN** `gameStatus` becomes `finished`

### Requirement: State store implementation

The system MUST back `GameState` with a Zustand store exposing action methods (`selectRole`, `selectPortfolio`, `startGame`, `submitAnswers`, `nextRound`, `restart`).

#### Scenario: Store actions are pure
- **WHEN** any action is dispatched
- **THEN** the store returns the new immutable state and triggers React re-render for subscribed components

### Requirement: Local persistence of history

The system MUST persist a JSON-serialized history of completed games under the `localStorage` key `macromap.history`, and MUST load it on boot to display past scores.

#### Scenario: Save after a finished game
- **WHEN** a game's status transitions to `finished`
- **THEN** the system appends a `HistoryRecord { role, totalScore, diagnosisType, finishedAt }` to `localStorage`

#### Scenario: Load on boot
- **WHEN** the application boots and `localStorage["macromap.history"]` exists
- **THEN** the history list on the start screen displays all saved records, newest first

#### Scenario: Corrupted history handling
- **WHEN** the stored history cannot be parsed
- **THEN** the system MUST discard it and start with an empty history, without crashing

### Requirement: Reset and replay

The system MUST provide a `restart` action that resets the in-memory state back to the initial `notStarted` shape WITHOUT erasing persisted history.

#### Scenario: Restart clears only the active game
- **WHEN** `restart` is dispatched from the finished screen
- **THEN** `currentRound` returns to `0`, `scoreBoard` returns to zeros, and `localStorage` history is unchanged

