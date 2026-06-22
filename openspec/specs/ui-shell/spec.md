# ui-shell Specification

## Purpose
TBD - created by archiving change bootstrap-mvp. Update Purpose after archive.
## Requirements
### Requirement: Three-panel main layout

The main game page MUST render a three-region layout: top status bar, left/center game area (map + event card + variable/asset/role panels), and bottom player action + explanation area.

#### Scenario: Layout renders without overflow
- **WHEN** the main game page is shown on a 1280×800 viewport
- **THEN** all panels are visible without horizontal scroll

### Requirement: Top status bar

The status bar MUST display current round (`N / 5`), selected role, current total score, current portfolio value vs initial 100, and the current risk band badge.

#### Scenario: Status bar updates each round
- **WHEN** a new round starts
- **THEN** the round counter increments and all other fields refresh to reflect the latest state

### Requirement: Role selection page

The role selection page MUST display the 5 roles as selectable cards with label, summary, and key concerns, and require confirmation before proceeding.

#### Scenario: Confirmation flow
- **WHEN** the player selects a role and clicks "下一步"
- **THEN** the store records `selectedRole` and the portfolio selection page renders

### Requirement: Portfolio selection page

The portfolio selection page MUST show 4 preset cards and a "自定义" tab that opens a weight editor; player MUST confirm before proceeding.

#### Scenario: Preset vs custom
- **WHEN** the player picks a preset
- **THEN** the system loads that portfolio's weights into the store and proceeds to round 1

### Requirement: World map component

The world map component MUST render the 6 regions as styled SVG shapes colored by current `regionEffects`, and MUST show a tooltip on hover or tap.

#### Scenario: Map reflects event
- **WHEN** a round's event has `regionEffects.usa.score = -1`
- **THEN** the USA region renders light red

### Requirement: Report page

The report page MUST show total score, 7-dimension breakdown, diagnosis type, advice, and a history of the past 10 scores pulled from `localStorage`.

#### Scenario: Report renders after round 5
- **WHEN** the player completes round 5
- **THEN** the report page replaces the main game page and shows the player's stats

### Requirement: Responsive baseline

The UI MUST remain usable (readable text, tappable targets) at viewport widths down to 768px; mobile-first polish is optional but not required for MVP.

#### Scenario: Tablet viewport
- **WHEN** the page is opened at 768px width
- **THEN** all panels reflow into a single column without overlapping text

