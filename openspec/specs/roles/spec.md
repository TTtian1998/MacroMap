# roles Specification

## Purpose
TBD - created by archiving change bootstrap-mvp. Update Purpose after archive.
## Requirements
### Requirement: Role keys

The system MUST define exactly 5 roles: `trader`, `officeWorker`, `businessOwner`, `civilServant`, `fundManager`.

#### Scenario: Role completeness
- **WHEN** `RoleKey` is imported
- **THEN** it contains exactly the 5 listed string literals

### Requirement: Role selection UI

The system MUST present a role selection screen where the player picks one of the 5 roles, with each role showing its label, summary, and key concerns.

#### Scenario: Player selects a role
- **WHEN** the player clicks a role card and confirms
- **THEN** `selectedRole` is set in the game store, and the next screen is the portfolio selection

### Requirement: Role-specific impact rendering

For each event, the system MUST render `roleEffects[selectedRole]` as the role impact narrative, reflecting that role's concerns (e.g., `trader` → 持仓收益/回撤/风险敞口).

#### Scenario: Trader impact display
- **WHEN** the player is a `trader` and the event is 美国CPI超预期
- **THEN** the role impact panel shows the trader-specific advice: "高估值成长股仓位需要控制，关注美债收益率和美元。"

#### Scenario: Office worker impact display
- **WHEN** the player is an `officeWorker` and the event is 美国CPI超预期
- **THEN** the role impact panel shows the office-worker-specific advice about 通胀压力/生活成本/房贷压力

### Requirement: Role survival score

The system MUST compute a `roleSurvivalScore` dimension in `ScoreBoard` based on how well the player's portfolio and decisions align with the role's natural sensitivities (e.g., an `officeWorker` benefits from lower inflation and stable employment indicators).

#### Scenario: Survival scoring
- **WHEN** the game ends
- **THEN** `roleSurvivalScore` is between 0 and 100, reflecting the cumulative round-by-round role-fitness of the chosen portfolio

