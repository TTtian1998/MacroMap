## ADDED Requirements

### Requirement: Region keys

The system MUST define exactly 6 regions: `usa`, `china`, `europe`, `japan`, `middleEast`, `emergingMarkets`.

#### Scenario: Region completeness
- **WHEN** `RegionKey` is imported
- **THEN** it contains exactly the 6 listed string literals

### Requirement: Region state colors

The system MUST render each region on the world map in one of 5 colors corresponding to its `score` from the current event's `regionEffects`: green (受益, score ≥ 1), red (受损, score ≤ -1), yellow (不确定, 0), gray (影响较小, undefined), with intensity scaling with magnitude.

#### Scenario: Color reflects score
- **WHEN** a region has `score: 2`
- **THEN** it is rendered deep green; `score: 1` light green; `0` yellow; `-1` light red; `-2` deep red

### Requirement: Region tooltip

Hovering or tapping a region MUST surface a card with the region's Chinese label, current score, and the `reason` string from `EffectDetail`.

#### Scenario: Tooltip on hover
- **WHEN** the user hovers a region
- **THEN** a tooltip appears within 200ms showing label, score, and reason

### Requirement: Region focus areas

Every region MUST expose a `focusAreas` string array summarizing what it cares about (e.g., `usa` → 美联储/美元/美债/科技股/消费/就业).

#### Scenario: Region detail page
- **WHEN** the player opens a region detail card
- **THEN** the `focusAreas` are listed as bullets