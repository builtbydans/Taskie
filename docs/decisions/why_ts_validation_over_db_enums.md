# Why TypeScript Validation over Database Enums

## Constraints vs Speed

For the initial versions of Taskie, I chose to keep certain fields such as `CalendarEvent.type` as flexible `TEXT` columns in PostgreSQL rather than enforcing strict database enums or check constraints.

Instead, the validation will be handled in the application using TypeScript union types and backend logic. Yes, the source of truth should be
the db, but at this stage of the project, the priority is rapid iteration and domain discovery, rather than rigid database modelling.

The scheduling engine and event system are still evolving, and event categories may change frequently as the product direction becomes clearer.

Using database-level enums too early would introduce:

- frequent schema migrations
- tighter coupling between product experimentation and database structure
- slower iteration when introducing new event types

By keeping the database flexible and enforcing constraints in TypeScript, I can:

- move faster during early product development
- maintain autocomplete and type safety inside the codebase
- evolve categories without repeated DB migrations
- keep the schema lightweight while the domain model stabilises

# Tradeoffs

This approach intentionally sacrifices some database-level protection.

Because PostgreSQL does not currently enforce valid event types, invalid values could theoretically enter the database if backend validation fails or data is inserted externally.

Examples:

MEETING
meeting
Meetng

This is an accepted tradeoff for the current stage of development.

# Future Direction

As the system matures and the domain model stabilises, I may transition toward stronger database-level guarantees through either:

- PostgreSQL enums
- CHECK constraints
- dedicated relational lookup tables

At the current stage, prioritising development speed and architectural exploration provides more value than rigid persistence constraints.
