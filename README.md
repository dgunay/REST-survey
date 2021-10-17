# REST survey

I greenfielded a couple of REST APIs at work and ran into a bunch of annoying
problems. I'd like to see if there is a framework out there that solves as many
of them as possible.

Some of this isn't strictly relevant, such as the choice of database provider,
but comes up a lot when developing REST APIs so I wanted to survey that too.

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
