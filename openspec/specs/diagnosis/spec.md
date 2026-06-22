# diagnosis Specification

## Purpose
TBD - created by archiving change bootstrap-mvp. Update Purpose after archive.
## Requirements
### Requirement: Diagnosis types

The system MUST classify the player's profile into exactly 4 mutually exclusive diagnosis types: 热点追逐型, 宏观敏感型, 风险控制型, 资产配置型.

#### Scenario: Diagnosis catalog
- **WHEN** the report page renders
- **THEN** exactly one diagnosis type is shown, picked by rule from the player's scoreboard and round history

### Requirement: Classification rules

The system MUST apply rule-based classification:
- 热点追逐型: many correct answers on simple `direction` questions but low `macroUnderstanding` and high risk-band frequency.
- 宏观敏感型: high `interestRateSensitivity` and `dollarSystemUnderstanding`, but high round-to-round churn.
- 风险控制型: most rounds in the low-risk band, low exposure to volatile assets.
- 资产配置型: balanced dimension scores with low max drawdown.

#### Scenario: Classification applied
- **WHEN** the game ends
- **THEN** exactly one diagnosis matches the player's pattern, with the matching rule's name and rationale shown

### Requirement: Personalized advice

Each diagnosis type MUST ship with a fixed advice string of 1–2 sentences shown on the report page.

#### Scenario: Advice rendered
- **WHEN** the report page renders
- **THEN** the advice string for the matched diagnosis appears below the diagnosis title

### Requirement: Weakness highlights

The system MUST highlight the 1–2 dimensions with the lowest scores on the report page.

#### Scenario: Weakness callout
- **WHEN** the report page renders
- **THEN** the lowest-scoring dimensions are flagged with a "建议强化" tag

