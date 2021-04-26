# Tests

- Keep the description blocks simple, explaining what is the test about, not how you are testing it:

```js
// ❌ Wrong
it(
  'focuses the previous element when the user presses the down arrow key, the next element when the user presses the up arrow key and loops, the first element when the user is in the last element and presses the down arrow key, and the last element when the user is in the first element and presses the up arrow key '
);

// ✅ Good
it('changes the selected element when navigating with the arrow keys');
```

- The sentence must make sense when concatenating it with the `it` test method:

```js
// ❌ Wrong
it('the element is focused when the dropdown is open');

// ✅ Good
it('focuses the element when the dropdown is open');
```
