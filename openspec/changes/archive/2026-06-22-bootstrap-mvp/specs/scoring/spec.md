## ADDED Requirements

### Requirement: Scoring dimensions

The system MUST compute 7 dimensions in `ScoreBoard`: `macroUnderstanding`, `interestRateSensitivity`, `dollarSystemUnderstanding`, `commodityCycleUnderstanding`, `equityValuationUnderstanding`, `riskControlAwareness`, `roleSurvivalScore`.

#### Scenario: Scoreboard shape
- **WHEN** the game ends
- **THEN** `ScoreBoard` exposes all 7 fields, each a non-negative integer

### Requirement: Question-to-dimension mapping

Each question MUST map to one or more dimensions via a metadata field or rule; correct answers increase the mapped dimensions by a fixed increment (MVP: +10 per correct dimension hit).

#### Scenario: Correct rate-sensitive answer
- **WHEN** the player answers a `direction` question about 美债收益率 correctly
- **THEN** `interestRateSensitivity` and `macroUnderstanding` each gain points

### Requirement: Score range

Each dimension MUST be clamped to `[0, 100]` at end-of-game.

#### Scenario: Score clamp
- **WHEN** accumulated correct answers would push a dimension above 100
- **THEN** the displayed value is `100` (no overflow)

### Requirement: Total score

The system MUST compute a `totalScore` as the sum of all 7 dimensions, ranging from 0 to 700.

#### Scenario: Total score display
- **WHEN** the final report renders
- **THEN** `totalScore` is displayed prominently and equals the arithmetic sum of the 7 dimensions