## ADDED Requirements

### Requirement: Variable keys

The system MUST define exactly 8 macro variables: `interestRate`, `usd`, `inflation`, `growth`, `riskAppetite`, `liquidity`, `commodityPrice`, `creditStress`.

#### Scenario: Type completeness
- **WHEN** `MacroVariableKey` is imported
- **THEN** it is a union of exactly the 8 listed string literals

### Requirement: Score range

Every variable effect MUST be an integer in the closed range `[-2, 2]`.

#### Scenario: Out-of-range guard
- **WHEN** an event declares `variableEffects.X`
- **THEN** the value is one of `-2, -1, 0, 1, 2`; otherwise the data validator reports an error at build time

### Requirement: Variable meaning

The system MUST display a tooltip or info row for every variable with a concise plain-language definition (利率/美元/通胀/经济增长/风险偏好/流动性/商品价格/信用压力).

#### Scenario: User inspects a variable
- **WHEN** the player hovers or taps a variable row
- **THEN** the system shows the Chinese label and a one-sentence definition explaining how it affects bonds, equities, currencies, or commodities

### Requirement: Variable panel updates

The variable panel MUST update at the start of each round to show the cumulative effect of the current event.

#### Scenario: Round transition
- **WHEN** a new round begins
- **THEN** the panel reflects the `variableEffects` of that round's event, with arrows or color indicating direction