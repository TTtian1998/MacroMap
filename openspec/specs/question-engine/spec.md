# question-engine Specification

## Purpose
TBD - created by archiving change bootstrap-mvp. Update Purpose after archive.
## Requirements
### Requirement: Supported question types

The system MUST support three question types: `direction` (multiple choice, pick one), `chainSort` (click in order to sort causal steps), and `decision` (multiple choice, pick one).

#### Scenario: Each type renders correctly
- **WHEN** the question panel receives a question of any of the three types
- **THEN** it renders the appropriate input control (radio buttons, ordered list, radio buttons) and accepts exactly one answer

### Requirement: Answer validation

The system MUST compare the player's answer against the `answer` field of the question and emit a boolean correctness result, then surface the `explanation` string.

#### Scenario: Correct direction answer
- **WHEN** the player selects "减弱" for the CPI降息预期 question whose `answer` is `"减弱"`
- **THEN** the system marks the answer correct and reveals the explanation text

#### Scenario: Incorrect answer still shows feedback
- **WHEN** the player selects a wrong option
- **THEN** the system marks it wrong, still reveals the explanation, and visually highlights the correct answer

### Requirement: Chain sort correctness

For `chainSort` questions, the system MUST treat the player's ordered list as correct only when every adjacent pair matches the canonical order.

#### Scenario: Correct chain order
- **WHEN** the player orders: 美联储加息 → 美元走强 → 新兴市场资金流出 → 本币贬值压力上升
- **THEN** the system marks the answer correct

#### Scenario: Partial chain swap
- **WHEN** the player swaps the last two items
- **THEN** the system marks the answer incorrect and reveals the correct order

### Requirement: Decision question scoring

`decision` questions MUST accept any of the listed options as the answer, and questions where multiple answers are defensible MUST have their `answer` reflect the recommended one while still being explainable.

#### Scenario: Decision feedback
- **WHEN** the player picks "全仓追高成长股" for a 降息预期减弱的 scenario
- **THEN** the system marks the answer incorrect and explains why high-beta growth positioning is risky when rates rise

