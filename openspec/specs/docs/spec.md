# docs Specification

## Purpose
TBD - created by archiving change bootstrap-mvp. Update Purpose after archive.
## Requirements
### Requirement: README content

The repository MUST contain a `README.md` covering: project overview, quickstart (`npm install && npm run dev`), tech stack, directory layout, how to add a new event card, how to add a new role, how to add a new preset portfolio, and a disclaimer that the game is educational only and does not constitute investment advice.

#### Scenario: README present at root
- **WHEN** a new contributor clones the repo
- **THEN** `README.md` exists at the repo root and answers the 7 questions above

### Requirement: Add-event-card guide

The README MUST include a "How to add a new event card" section that points at `src/data/events.ts` and shows a minimal example with all required fields.

#### Scenario: Contributor adds an event
- **WHEN** a contributor follows the README's guide
- **THEN** they can add a new event by editing one TypeScript file and the type system enforces required fields

### Requirement: Risk disclaimer

Every game screen that surfaces portfolio outcomes (main game, report) MUST display the disclaimer "本游戏用于金融知识学习，不构成任何投资建议。"

#### Scenario: Disclaimer present
- **WHEN** the player views the main game or report page
- **THEN** the disclaimer is visible at the bottom or footer area

