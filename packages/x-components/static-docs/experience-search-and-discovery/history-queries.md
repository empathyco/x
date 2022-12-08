---
title: History Queries UI
---

The History Queries UI component displays the search history, allowing shoppers to check previous
searches and revisit products they’ve viewed before in a few clicks.

![History Queries](~@assets/media/interface/x-history-queries.gif)

::: interact

Can't quite capture the concept? Learn more about
[History Queries](../features/history-queries-overview.md).

:::

## Tailor the web experience

- Configure the position and place it wherever you prefer. Combine it with the
  [Empathize](empathize.md) container to display suggestions under the search bar on shopper
  interaction.
- Show as many history suggestions as you want.
- Choose the number of search records to store in the browser’s local storage to refresh the history
  list.
- Animate the display of History Queries at your ease.
- Customize content. Show whatever you need: text, images, icons.
- Display History Queries only from successful searches. No result, no search record stored. (Search
  X module required.)
- Configure clear buttons at your convenience. Let shoppers clear previous searches one-by-one,
  all-at-once, or either way.
- Display only the refined queries to match shopper intent. For example, if “dress” is the initial
  search, and it’s narrowed down using “long dress”, the history queries list only displays “long
  dress” since it represents the shopper’s real intention.

::: interact

Want to know more? Learn how to [configure](/develop-empathy-platform/ui-reference/components/history-queries/) your web
experience.

:::

## Extend the performance

You can extend search history performance by combining it with the [Next Queries](next-queries.md)
component. All suggestions for shoppers about what to look next can be filtered against the
shopper’s search history so that only those suggestions that haven’t been used before in that
session will display.

Combine History Queries with the [Search module](/develop-empathy-platform/ui-reference/components/search/) to ease shoppers' frustrations. That way, you can
configure it to display only successful history searches.

::: note Search history tracking

Use the [My History](my-history.md) component to access and control search history. Shoppers can view a complete list of history queries and decide to stop saving search history. If search history is disabled, the History Queries list is cleared.

::: 

::: interact 

To know more about which data is stored in the browser’s data storage, check out [Interface X data privacy and browser local storage](web-local-storage.md).

:::
