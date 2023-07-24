---
title: Design the Recommendations UI experience
sidebar_title: Recommendations UI
tags:
  - top clicked
  - top searched
  - trending
  - trending products
  - top products
  - popular
---

Product recommendations, such as Top Products, Brand Recommendations, Next Products, and Vectorized Recommendations, help your shoppers explore your product catalogue, guiding them to specific products without the need to launch any queries.

<!-- ![Recommendations](~@assets/x/interface/x-recommendations.gif) -->
![Recommendations](~@assets/x/interface/x-recommendations.svg)

::: interact  
Can't quite capture the concept? Learn more about
[Recommendations](/explore-empathy-platform/features/recommendations-overview.md).
:::

## Product recommendation modules and components  

The Interface X Components library includes the following modules and components to layout multiple experiences to show product recommendations in your search UI:

<CardCarousel :cards="[
    'ui_ref/recommendations',
    'ui_ref/semantics',
    'ui_ref/preview',
    'ui_ref/nq'
    ]"
/>

::: warning

For correct performance, make sure that your current search service supports
this type of features.

:::

## Tailor the web experience
Based on your business strategy and your shoppers’ needs, the Interface X Components library offers the following configuration options and properties:

::: details Top Products UI experience
Use the Recommendations module to configure the layout of Top Products in your commerce search UI. You can:
- Configure the position and place it wherever you prefer, although it commonly appears on the SERP, among the product results.
- Show as many product recommendations as you want.
- Animate the display of the component at your ease.
- Customize content. Show whatever you need: text, images, icons.
- Extend the performance with result-related components.

:::


::: details Vectorized Recommendations UI experience    

Use the Semantics Queries module to configure the layout of Vectorized Recommendations in your commerce search UI. You can:
- Configure the position and place it wherever you prefer, although it usually appears on the SERP, among the product results.
- Show as many product recommendations as you want. Display the total number of recommendations shown.
- Use different layouts: carousel, list, grid. Although, a carousel or horizontal slider panel is the preferred layout.
- Animate the display of the component at your ease.
- Customize content. Although, the name of product recommendations is shown by default.
- Extend the performance with query preview-related components to display related content, such as the suggested query, product result images, and links.

::: 


::: details Brand Recommendations UI experience  

Use the Queries Preview module to configure the layout of Brand Recommendations in your commerce search UI. You can:
- Configure the position and place it wherever you prefer, although it usually appears at the pre-search stage.
- Display the suggested queries and the total number of recommendations shown.
- Use different layouts: carousel, list, grid. Although, a carousel or horizontal slider panel is the preferred layout.
- Animate the display of the component at your ease.
- Customize content. Although, the name of product recommendations is shown by default.
- Extend the performance with result-related components to display related content, such as product result images and links.

:::


::: details Next Products UI experience  

Use the Next Query Preview component to configure the layout of Next Products in your commerce search UI. You can:
- Configure the position and place it wherever you prefer, although it usually appears on the SERP, among the product results.
- Show as many product recommendations as you want. Display the total number of recommendations shown.
- Use different layouts: carousel, list, grid. Although, a carousel or horizontal slider panel is the preferred layout.
- Customize content. Although, the suggested query and the name of product recommendations are shown by default.
- Extend the performance with result-related components to display related content, such as product result images and links.

:::

::: interact

Want to know more? Learn how to [configure](/develop-empathy-platform/ui-reference/components/recommendations/x-components.recommendations.md)
your web experience.

:::
