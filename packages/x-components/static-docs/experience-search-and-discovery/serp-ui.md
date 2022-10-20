---
title: SERP UI
tags:
  - results layout
  - grid
  - results grid
---

To handle and display search results, the layout of results and other related discovery features is
paramount. For example, how to arrange results on the SERP or the features shoppers expect to easily
navigate and organize results are key points to have in mind. <br/>

![X Components for results layout](~@assets/media/interface/x-results-layout.svg)

<FootNote>

**X&nbsp;Components for results layout** <br/> (A) Grid, (B) Number of results, (C) Column Picker,
(D) Sorting, and (E) Scrolling

</FootNote>
<br/>

**Choice of the layout view**  
Your shoppers should be able to select how they’d like the products
displayed and how the number of products they’d like to see per page, for example.

That’s why the **grid** (A) is the core element of the SERP. It displays the results returned by the
search service using a grid layout. Its value relies on having a configurable and flexible space to
place all types of results or even other layout components such as a carousel visualization for
[Next Queries](next-queries.md) or [Recommendations](recommendations.md).

However, the grid is not the only element to consider when designing the SERP:

- Show the **number of results** (B).
- Allow your shoppers to select the **number of columns** (C) to showcase results.
- Provide a **[sorting system](/explore-empathy-platform/overview/sorting-overview.md)** (D) so that
  your shoppers can arrange results according to different criteria such as relevance, price,
  alphabetical order…
- Include **[pagination](/explore-empathy-platform/overview/pagination-overview.md)** options to
  browse results throughout the different result pages available or apply infinite scroll to ease
  navigation.
- Apply **infinite scroll** to ease navigation and add a **scroll-to-top button** (E) to quickly
  move to the top of the results page.
- Indicate your shoppers whether the
  **[Spell Check](/explore-empathy-platform/features/spellcheck-overview.md)** feature is applied or
  not.

::: note

Enhance the search experience, adding [Related Tags](related-tags.md) to the SERP so that your
shoppers can select descriptive keywords to refine the initial query and get highly relevant
results.

:::

::: design

As most shoppers don’t like to spend time scrolling and moving between pages, a crucial element on
the SERP for a great experience is to offer **faceted search**, letting shoppers specify the kind of
product attributes they’re interested in.

:::

::: interact

To learn more about the SERP, results display, and their layout, see
[Results on the SERP](../overview/results-overview.md).

:::

## Tailor the web experience

**Grid**

- Customize the layout of the results. Decide whether to display results using a grid or the default
  list layout.
- Configure what to display: product results, promotion banners, promoted results, or even next
  queries and recommendations.
- Customize the location, style, and content for each type of result.
- Automatically fill the grid rows with as many columns as it can fit or set the number of columns
  to divide the grid.
- Indicate the number of product results to render per page.
- Animate the display of the grid at your ease.
- Allow your users to select the number of columns to display. Define if your shoppers will be
  provided with a dropdown menu or a list with the columns to pick for the grid.
- Show the total number of product results displayed. Configure the content with text, images, or
  icons.

**Sorting**

- Choose and configure the sorting options available. Highlight the selected sorting option.
- Select the display of the sorting system: dropdown menu or a simple list with the sorting options
  available.
- Animate the display of the sorting dropdown menu.
- Set a default sorting option.
  <!-- TBC: Decide which sorting option to display based on product category. -->

**Pagination & scrolling**

- Customize the content and style for the controls to move between pages.
- Include an infinite scroll to load more results when reaching the end of the page.

**Scrolling to top**

- Decide when it will be displayed: when reached a defined threshold or the page end.
- Configure the position and place it wherever you prefer.
- Customize content. Show whatever you need: text, images, icons.
- Animate the display of the scroll-to-top button at your ease.

**Spell check**

- Display a message to inform your shoppers that the
  [Spell Check](../features/spellcheck-overview.md) feature has been used to provide results for the
  current query.
- Customize the message content at your ease.

::: interact

Want to know more? Learn how to [configure](/develop-empathy-platform/ui-reference/) your web
experience.

:::

