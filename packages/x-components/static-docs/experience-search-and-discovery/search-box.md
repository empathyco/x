---
title: Search Box UI
tags: 
  - search input
  - search bar
  - search field
  - input
---

The Search&nbsp;Box UI Component is the main entry point for search where shoppers can type what
they're looking for in your shop. It usually includes an input field, a search button, and a clear
button.

![Search box](~@assets/media/interface/x-search-box.svg)

::: interact

Can't quite capture the concept? Learn more about [Search Box](../overview/search-box-overview.md).

:::

It can be combined with other X&nbsp;Components, such as [Query Suggestions](query-suggestions.md)
or [Next Queries](next-queries.md), to update the query according to shoppers’ intent or behaviour.
For example, if a shopper selects a query suggestion, the query is instantly updated in the input
field to the selected suggestion and the search is launched.

::: warning

To modify the query syntax using [Query Suggestions](../features/query-suggestions-overview.md) or
[Next Queries](../features/next-queries-overview.md), make sure that your current search service
supports this type of feature.

:::

## Power-up behavior

Every component has a power-up behavior under the hood that is visible to the user but not glaringly
obvious. For example, in Interface X Components for web, see what happens when:

- _A query with results is **submitted**_:

  - Results are displayed
  - Related tags are displayed
  - Next queries are displayed
  - The query can be displayed in the History Queries or Query Suggestions lists upon configuration

- _A query with results is **cleared** using the clear button_:

  - Any text in the search input is cleared
  - The results are cleared
  - The query suggestions are cleared
  - The next queries are not cleared
  - The related tags are cleared
  - The searched query is displayed in history queries

- _Using **instant search and a query is being typed** that has results_:

  - No results are displayed before debounce time
  - Results are displayed after debounce time
  - Next queries are displayed after debounce time
  - Related tags are displayed after debounce time

- _Using **instant search and modifying the initial query**_:
  - No results related to the second query are displayed before debounce time
  - Results related to the second query are displayed after debounce time
  - Displayed results are different from the previous ones

::: warning

Deactivating instant search means History Queries are not updated until the search button or Enter
key is pressed, since the typed query is not submitted until one of these two actions is performed.

:::

## Tailor the web experience

- Configure the position and place it wherever you prefer.
- Customize content. Allow shoppers to search or clear their search using text or icons.
- Determine the number of characters shoppers can enter in the search input.
- Autofocus the input field when the search&nbsp;box is displayed.
- Auto-accept the query without the need of using a search button or the Enter key. Determine the
  debounce time to wait before instant search.
- Configure what will happen after the search is triggered; for example, display Related Tags or
  Next Queries.

<!-- TO BE PUBLISHED IN FUTURE ITERATIONS WHEN THE SEARCH BOX POWER-UP ARE IMPLEMENTED: * Automatically suggest search terms to guide shoppers in constructing their search query. * Prompt shoppers to start their search with animated custom hint messages. -->

::: interact

Want to know more? Learn how to [configure](/develop-empathy-platform/ui-reference/components/search-box/) your web
experience.

:::


