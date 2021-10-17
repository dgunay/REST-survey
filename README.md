# REST survey

I greenfielded a couple of REST APIs at work and ran into a bunch of annoying
problems. I'd like to see if there is a framework out there that solves as many
of them as possible.

Some of this isn't strictly relevant, such as the choice of database provider,
but comes up a lot when developing REST APIs so I wanted to survey that too.

I would also ideally like to benchmark it, but I want to be certain I'm being
fair to each combination of language/framework and using them correctly and
performantly. Arguably I could consider the ease of producing a performant
service part of their worth.

## Problems

### Database

- Does it have convenient integration with many different DB providers?
- Does it support polymorphic has-many relations?
- Does it have convenient propagation of updates/deletions across relations?

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

- Does it support doctests?
- Does it let me generate OpenAPI specifications from the code without having to
  manually specific things like errors and responses?
- Is it able to serve live documentation for the routes?
- Is it able to dump that documentation to a static site?
