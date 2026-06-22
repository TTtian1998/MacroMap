## ADDED Requirements

### Requirement: Asset keys

The system MUST define exactly 10 assets: `usTechStocks`, `chinaGrowthStocks`, `hkInternetStocks`, `usBonds`, `gold`, `oil`, `copper`, `banks`, `consumerStocks`, `cash`.

#### Scenario: Asset completeness
- **WHEN** `AssetKey` is imported
- **THEN** it contains exactly the 10 listed string literals

### Requirement: Asset weight normalization

For any selected portfolio, the weights across all 10 assets MUST sum to 100 (percent), and MUST all be non-negative.

#### Scenario: Preset portfolio sums to 100
- **WHEN** a preset portfolio (e.g., 激进成长组合) is loaded
- **THEN** `sum(weights) === 100`

#### Scenario: Custom portfolio validation
- **WHEN** the player finalizes a custom portfolio
- **THEN** the system rejects it unless weights sum to 100 with no negative entries, and shows an inline error otherwise

### Requirement: Asset driver documentation

Each asset MUST have a `coreDrivers` string array explaining its primary drivers (e.g., `usTechStocks` → 利率/AI景气/盈利/估值).

#### Scenario: Driver tooltip
- **WHEN** the player hovers an asset row
- **THEN** the drivers are listed as concise bullets

### Requirement: Asset impact color

The asset panel MUST render each asset's score in the same 5-color scale as regions, with an arrow icon indicating direction.

#### Scenario: Asset impact rendered
- **WHEN** a round event has `assetEffects.oil.score = 2`
- **THEN** the `oil` row is highlighted deep green with an up arrow and the `reason` text appears next to it