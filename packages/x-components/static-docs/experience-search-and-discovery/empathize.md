---
title: Empathize UI
tags:
    - predictive layer
    - search box
---

Empathize is a UI container, but not just any container. It’s the
**[predictive layer](/explore-empathy-platform/overview/predictive-layer.md)** for your search
experience that is usually displayed below the search box. Consider it the natural companion of the
**[search box](search-box.md)**, featuring search suggestions and recommendations.

![Empathize](~@assets/media/interface/x-empathize.gif)

One of the characteristics of Interface&nbsp;X&nbsp;Components is that you can place them
wherever you want. However, you know that the placement of the search box in your shop matters. So,
why have search suggestions and recommendations spread all over the page, far away from the search
box? The Empathize container brings everything together so that your shoppers perceive a smooth,
effortless search experience.

## Use Empathize with...

Being the face of your predictive layer, Empathize comes into play before the search process starts
and only makes sense when used with other components.

Thanks to the nature of Interface&nbsp;X&nbsp;Components, you can [mix and match the components](/explore-empathy-platform/experience-search-and-discovery/readme.md#mix-and-match-your-experience)  you use within
Empathize. For example, provide shoppers with search ideas and use Empathize to display popular
search terms and trending products. Anticipate your shoppers’ intent with recent searches and
query suggestions. Or give shoppers access to their [complete search history](my-history.md) and let them control tracking search data. There are lots of handy possibilities that you might want to place close to the
search box.

**Combine Empathize with:**

- [Popular Searches](popular-searches.md)
- [Recommendations](recommendations.md)
- [History Queries](history-queries.md)
- [Query Suggestions](query-suggestions.md)
- [Next Queries](next-queries.md)
- [ID Results](id-results.md)

## How it works...

Empathize is an event-driven component. It's determined by events that make it react to shoppers'
actions, such as clicks or keystrokes. That is the Empathize magic; the component listens by default
to some events to expand the container and others to collapse it. However, this behavior is
configurable.

The Empathize container expands when:

- The search box is focused.
- The shopper clicks on the input field.
- A query is being typed.

Likewise, the Empathize closes when:

- The shopper closes the Empathize layer.
- A query suggestion is selected.
- The shopper presses Enter.
- The search box loses focus.

Also, it can listen to scroll events to expand and collapse the layer when shoppers scroll up or
down.

### Extend the performance

The Empathize container is collapsible so that it expands and collapses on shopper interaction. By
default, this behaviour matches the search input focus: clicking the search input expands the
Empathize container. Likewise, if the search input loses focus, e.g. the shopper clicks on a
suggestion and launches the search, the Empathize container disappears.

Alternatively, combine Empathize with one of the scroll components to make it react to scroll in
addition to or replacing the search box focus. You may prefer to make it more accessible with the
Keyboard Navigation component. Your shoppers can navigate the components in Empathize with the
keyboard arrow keys.

**Enhance Empathize usability with...**  

- Keyboard scroll
- Keyboard navigation

::: interact

Learn more on how to improve the usability of the Empathize UI component using the [Base Scroll](/develop-empathy-platform/ui-reference/components/base-components/scroll/x-components.base-scroll.md) and [Base Keyboard Navigation](/develop-empathy-platform/ui-reference/components/base-components/x-components.base-keyboard-navigation.md) components in the X&nbsp;Components UI Reference.

:::


## Spot the difference

Here, Empathize is the **predictive layer** holding the advanced search capabilities built in the
back. However, in backend terms, Empathize is an Empathy Platform service, fed by a **batch
application**, that uses the interaction data collected by the
[Tagging microservices](/explore-empathy-platform/capture-shopper-interaction/) to build advanced
search capabilities, such as Query Suggestions and Popular Searches. Don’t get confused!

## Tailor the web experience

- Customize content. Display whatever search-related suggestion components you need.
- Determine when Empathize appears and disappears.
- Animate how the component opens and closes.

::: interact

Want to know more? Learn how to [configure](/develop-empathy-platform/ui-reference/components/empathize/x-components.empathize.md) your web
experience.

:::
