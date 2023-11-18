# TS-Wrap

- Wrap your of results (or promises of results) to create elegant type safe code

### Examples

#### Archaic error handling
```typescript
const result1 = someOperation()

if (!result.ok) {
  const result2 = someOperation2(result.error)

  if (!result2.ok) {
    // Do more things
  }
} else {
   const result3 = someOperation3(result.value)

   if (!result.ok) {
      // Some stuff
   }
   // More of that stuff
}
```

#### TS-Wrap error handling
```typescript
const result =
  wrap(someOperation())
  .ifOkthen(async okValue => {
   // Some stuff here
  })
  .ifErrThen(async errValue => {
   // ErrorHandling stuff
  })
  .ifOkthen(async okValue => {
    // More stuff here
  })
```
