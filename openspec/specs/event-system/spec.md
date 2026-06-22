# event-system Specification

## Purpose
TBD - created by archiving change bootstrap-mvp. Update Purpose after archive.
## Requirements
### Requirement: Event data model

The system MUST model every event as a `MacroEvent` with `id`, `title`, `category`, `difficulty` (1|2|3), `description`, `variableEffects`, `regionEffects`, `assetEffects`, `roleEffects`, `questions`, and `explanation`.

#### Scenario: Required fields are present
- **WHEN** an event object is loaded from `src/data/events.ts`
- **THEN** it contains all listed fields and `variableEffects` only references valid `MacroVariableKey`s

### Requirement: Effect detail scoring

Every entry in `regionEffects` and `assetEffects` MUST be an `EffectDetail { score: -2|-1|0|1|2, reason: string }`.

#### Scenario: Score range is enforced
- **WHEN** an effect is rendered in the UI
- **THEN** its color and direction correspond to its score: `-2` strongly negative, `-1` mildly negative, `0` neutral, `+1` mildly positive, `+2` strongly positive

### Requirement: Event library completeness

The system MUST ship exactly 20 events covering all 8 categories: `usMonetaryPolicy` (4), `usEconomicData` (4), `chinaPolicy` (2), `chinaEconomicData` (3), `geopolitics` (2), `commoditySupply` (2), `technologyCycle` (1), `financialRisk` (2).

#### Scenario: Catalog audit
- **WHEN** the event library is loaded at startup
- **THEN** exactly 20 events are present with the category distribution above

### Requirement: Random event selection

The system MUST select 5 distinct events per game, sampled without replacement from the 20-event library, with at least one event from each of the 5 categories the player will encounter most.

#### Scenario: No duplicates within a game
- **WHEN** a new game starts
- **THEN** the 5 events selected for the 5 rounds have unique `id`s

#### Scenario: Difficulty coverage
- **WHEN** the 5 events are sampled
- **THEN** at least 2 of them have `difficulty >= 2`

### Requirement: Explanation structure

Every event MUST include an `Explanation { chain: string[], summary: string, knowledgePoints: string[] }` where `chain` is a sequence of 4–10 causal steps forming the macro transmission chain.

#### Scenario: Chain rendering
- **WHEN** the explanation panel renders after the player answers
- **THEN** the chain is displayed as an ordered list, summary is shown as a paragraph, and knowledge points are bulleted

### Requirement: Question types per event

Every event MUST include at least one `Question`, and events of `difficulty >= 2` MUST include at least two questions covering distinct types (`direction`, `chainSort`, or `decision`).

#### Scenario: Question presence check
- **WHEN** an event is loaded
- **THEN** `questions.length >= 1`, and if `difficulty >= 2` then `questions.length >= 2` with at least two distinct `type` values

