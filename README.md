# REST survey

I greenfielded a couple of REST APIs at work and ran into a bunch of annoying
problems that, IMO, should be easily solvable by a decent REST framework. Some
of them may be limited by the language and tools they are built on, some of them
don't have a lot of corporate support, and some of them just have no excuse.
Whatever the case, I'd like to see if there is a framework out there that solves 
as many of these issues as possible.

Some of this isn't strictly relevant, such as the choice of database provider,
but comes up a lot when developing REST APIs so I wanted to survey that too.

I would also ideally like to benchmark it, but I want to be certain I'm being
fair to each combination of language/framework and using them correctly and
performantly. Arguably I could consider the ease of producing a performant
service part of their worth.

An end-to-end test suite is in the `test/` folder. Start up one of the servers
and run it to check for compliance to the spec.

## Problems

### Database

- Does it have convenient integration with many different DB providers?
- Does it support polymorphic has-many relations?
- Does it have convenient propagation of updates/deletions across relations?
- Does it easily support soft deletes?
- How well does it natively express domain invariants:
  - Nullability (or lack thereof)?
  - Single ownership relations?
  - Unique combinations?
- Does the ORM (or at least the DB itself) support batch upsertion of records
  with varying fields changed?

### Access Patterns

- Does it support partial resource updates easily? (PATCHing some subset of 
  fields)

### Data transfer/DTOs

- How easy is it to validate the shape of the data coming in?
- How easy is it to convert to/from DTOs to database entities?

### Error Handling

- How easy is it to map my domain errors to HTTP errors without cluttering
  my routes?
- Is error handling done via exceptions, bare return values, or monads?

### Testing

- Is it easy to test controllers without excessive mocking?

### Language

- Is it statically typed?
- Does the type system prevent classes of errors?

### Documentation

- Does it support doctests or runnable examples?
- Does it let me generate OpenAPI specifications from the code without having to
  manually specific things like errors and responses?
- Is it able to serve live documentation for the routes?
- Is it able to dump that documentation to a static site?
- Can it handle nonstandard auth patterns (such as plain tokens in the header)?

## Design

This kind of entity design should (hopefully) exercise all the problems we're
after.

Foo:
  - has an immutable name
  - has some metadata (created, updated, deleted) as an entity but not as a DTO
  - has some uniform string data members
  - has many Bars

Bar:
  - owned by at most one Foo
  - has some uniform string data members
  - has a compound unique index on 2 of its fields
  - may have 1 Baz

Baz:
  - Can be shaped like potentially anything
  - Owned by at most one Bar, but uniqueness not enforced.
