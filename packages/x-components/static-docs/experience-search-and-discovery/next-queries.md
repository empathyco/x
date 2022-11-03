---
title: Next Queries UI
tags:
  - popular next queries
  - what's next
---

The Next Queries UI component provides shoppers with ideas on what to search for next based on their
last search. Since next queries are related to the last query, they appear after performing a first
search.

![Next Queries](~@assets/media/interface/x-next-queries.gif)

Next queries can be **organic**, using information on the most common searches that are performed
successively or within a same session by shoppers, or **curated**, created manually by the
merchandiser in the Empathy Platform Playboard.

::: warning

Organic next queries are generated using collective shopper behavior to identify query pairs that
have been used together. For a correct performance, make sure that your current search service
supports this feature.

:::

::: interact

Can't quite capture the concept? Learn about [Next Queries](../features/next-queries-overview.md).

:::

## Tailor the web experience

- Configure the position and place it wherever you prefer, although next queries usually display
  below the search bar after the initial search.
- Show as many next queries as you want.
- Animate the display of next queries at your ease.
- Customize content. Show whatever you need: text, images, icons.
- Display curated next queries differently to organic next queries.

::: interact

Want to know more? Learn how to
[configure](/develop-empathy-platform/ui-reference/components/next-queries) your web experience.

:::

::: design

Read how Empathy UX designer, Marlety García, designed the Next Queries experience for one of our
customers in the post
[Popular Next Queries: Towards a conversational search](https://empathy.co/blog/popular-next-searches/).

:::

## Extend the performance

You can combine Next Queries with the [History Queries](history-queries.md) component to display
next queries that shoppers haven't already used in the session.

::: warning

To display only new next queries, the [History Queries](/explore-empathy-platform/features/history-queries-overview.md)
feature must be implemented.

:::

