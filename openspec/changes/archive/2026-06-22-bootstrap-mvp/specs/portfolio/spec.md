## ADDED Requirements

### Requirement: Preset portfolios

The system MUST ship exactly 4 preset portfolios: 激进成长组合, 稳健配置组合, 周期商品组合, 防御现金组合.

#### Scenario: Preset catalog
- **WHEN** the portfolio selection screen renders
- **THEN** all 4 preset cards are shown with their asset allocation visualized

### Requirement: Custom portfolio

The system MUST allow players to manually configure weights with sliders or numeric inputs that sum to 100.

#### Scenario: Slider enforces sum-to-100
- **WHEN** the player adjusts an asset weight
- **THEN** the system normalizes other weights proportionally so the total remains 100

#### Scenario: Invalid custom portfolio blocked
- **WHEN** the player attempts to confirm a portfolio whose weights do not sum to 100
- **THEN** the system shows an inline error and disables the confirm button

### Requirement: Round return per asset

The system MUST translate each asset's `score` for a round into a return using the MVP table: `+2 → +4%`, `+1 → +2%`, `0 → 0%`, `-1 → -2%`, `-2 → -4%`.

#### Scenario: Apply round return
- **WHEN** an event with `assetEffects.usTechStocks.score = -2` resolves
- **THEN** the `usTechStocks` portion of the portfolio loses 4% of its weight contribution for that round

### Requirement: Portfolio value update

After each round, the system MUST recompute `portfolioValue = 100 × ∏(1 + assetWeight × assetRoundReturn)` (initial value 100) and append the round's result to `history`.

#### Scenario: Value updates after round 1
- **WHEN** the player finishes round 1
- **THEN** `portfolioValue` reflects the weighted return of round 1, and `history` has 1 entry

### Requirement: Risk classification

The system MUST classify the round's portfolio loss into 3 bands: 单回合亏损 > 5% 高风险, 2%–5% 中风险, < 2% 低风险.

#### Scenario: Risk band shown
- **WHEN** a round finishes
- **THEN** the status bar shows the risk badge with the matching band and color