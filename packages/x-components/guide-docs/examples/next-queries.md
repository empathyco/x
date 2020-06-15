## Next Queries Examples

  ## Basic example

  You don't need to pass any props, or slots. Simply add the component, and when it has any next
  queries it will show them

  ```vue
  <NextQueries />
  ```

  ## Overriding Next Queries' Content

  You can use your custom implementation of the Next Query's content.
  In the example below, instead of using the default Next Query's content, an icon
  is added, as well as a span with the query of the Next Query suggestion.

  ```vue
  <NextQueries>
    <template #suggestion-content="{suggestion}">
      <img src="./next-query-icon.svg" class="x-next-query__icon"/>
      <span class="x-next-query__query">{{ suggestion.query }}</span>
    </template>
  </NextQueries>
  ```

  ## Adding a custom next query component

  You can use your custom implementation of a next query component. To work correctly, it should
  use the `emitNextQuerySelected` function when the next query is selected.
  In the example below, instead of using the default `button` tag for a next query, an icon is
  added, and the text of the next query is wrapped in a `span`
  ```vue
  <NextQueries>
    <template #suggestion="{suggestion}">
      <NextQuery :suggestion="suggestion" class="x-next-queries__suggestion">
        <template #default="{suggestion}">
          <img src="./next-query-icon.svg" class="x-next-query__icon"/>
          <span class="x-next-query__query">{{ suggestion.query }}</span>
        </template>
      </NextQuery>
      <button>Custom Behaviour</button>
    </template>
  </NextQueries>
  ```
