---
title: Build your search UI for web
tags:
  - getting started
  - x integration
  - use x components
  - x components
  - interface x
---

::: slot left-intro-column

## Getting started with Interface X Components

Start building your search and discovery experience in a few simple steps:

:::

::: slot right-intro-column

<img :src="$withBase('/assets/media/build-search-ui.svg')" alt="Build Your Search UI">

:::

- **Discover more about the
  [Interface X ecosystem](/develop-empathy-platform/build-search-ui/README.md#the-interface-x-ecosystem)**
  and how Interface&nbsp;X works.
- **[Integrate the Interface X Components](/develop-empathy-platform/build-search-ui/README.md#integrate-x-components)**
  in your store web application.
- **[Use & configure the Interface X Components](/develop-empathy-platform/build-search-ui/README.md#use-configure-the-x-components)**
  in your project.

<!-- 3. Style your UI. 4. Translate your search experience-->
<!-- HIDE VIDEO UNTIL CONTENT BOX FIXED <VideoContent title="Want to learn more?" :links="[{title:'How-to guide',link:'/develop-empathy-platform/build-search-ui/web-x-components-integration-guide'},{title:'Architecture',link:'/develop-empathy-platform/build-search-ui/x-architecture/'},{title:'UI reference',link:'/develop-empathy-platform/ui-reference/'}]"></VideoContent>-->

## The Interface X ecosystem

The Interface&nbsp;X ecosystem consists of libraries of components for web. These independent
building blocks, with their own unique view and behavior, allows you to progressively build your
search and discovery experience. The more you add, the more functionality you get. There are
numerous components to choose from, and the catalog evolves quickly with new experiences.

Check out the **[open source project in GitHub](https://github.com/empathyco/x)**.

Interested in learning more about how Interface&nbsp;X works? Discover more about its
**[architecture](/develop-empathy-platform/build-search-ui/x-architecture/)**.

## Integrate Interface X Components

You can use the X&nbsp;Components in a project in two ways:

- using the separate **Interface&nbsp;X&nbsp;Archetype** project, an out-of-the-box project with all
  you need to get up and running fast, or
- integrating the individual **Interface&nbsp;X&nbsp;Components** library in your Vue project for a
  more custom approach.

::: note You can use Empathy Search API, Elasticsearch, or Solr endpoints with both approaches. :::

##### Integration via Interface X Archetype project

The **[Interface&nbsp;X&nbsp;Archetype](https://github.com/empathyco/x-archetype)** project is the
perfect combination of all the existing X&nbsp;Components. Instead of starting from a completely
blank canvas, ramp up quickly with an already working search and discovery experience. This is the
perfect solution for most cases. But don’t worry! It’s still super flexible! You’re still able to:

- Change the default styles for styles that match your application through design tokens or custom
  CSS.
- Change configuration parameters such as the number of suggestions, enable, or disable instant
  search.
- Change the layout, position, or the number of the components used.
- Use the individual X&nbsp;Component internationalization tool or use your own tool.
- Create new components or modify the existing ones.

To start using the X&nbsp;Archetype project, see
**[Integrate Interface X Archetype project](web-archetype-integration-guide.md)**.

##### Integration via Interface X Components library

This is the more deep and flexible use of the
**[Interface X Components library](https://github.com/empathyco/x/tree/main/packages/x-components)**,
allowing you to import any components you desire into your Vue application. It lets you connect,
customize, extend, style, or even create new components without any limitations. This is the way to
go if you like to look under the hood!

- Mix and match with other Vue components.
- Implement in Vue or React projects.
- Extend component behavior with your own development.
- Determine styles using design tokens or custom CSS.

To get started with the X Components library, check out
**[Integrate Interface X Components in your Vue application](web-x-components-integration-guide.md)**.

## Use & configure the Interface X Components

Using the Interface&nbsp;X&nbsp;Components is a piece of cake! Just import and register the
component, include it in your template, and you’re ready to go! What’s more, each component offers
multiple configuration parameters to play around with, allowing you greater flexibility over the
experience.

Unsure how to start? Check out
**[Use & configure Interface X Components in your project](web-use-x-components-guide.md)**.

<!--
## Style your UI

## Translate your search experience

-->
