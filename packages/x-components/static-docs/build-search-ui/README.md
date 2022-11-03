---
title: Build your search UI for web
tags:
  - getting started
  - x integration
  - use x components
  - x components
  - interface x
  - x archetype
  - archetype
---

::: slot left-intro-column

## Getting started with Interface X

Start building your search and discovery experience:

:::

::: slot right-intro-column

<img :src="$withBase('/assets/media/interface/build-search-ui.svg')" alt="Build Your Search UI">

:::

- **Discover the [Interface X ecosystem](#the-interface-x-ecosystem)** and how Interface&nbsp;X
  works.
- **[Develop using Interface X](#developing-with-interface-x)** inside your project.
- **[Integrate the Interface X Archetype](#integrating-interface-x-archetype)** in your store web
  application.
- **[Use and configure the Interface X Components](#using-and-configuring-the-interface-x-components)**
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
**[architecture](web-x-architecture.md)**.

## Developing with Interface X

You can use the Interface&nbsp;X in a project in two ways:

- using the separate **Interface&nbsp;X&nbsp;Archetype** project, an out-of-the-box project with all
  you need to get up and running fast
- importing the individual **Interface&nbsp;X&nbsp;Components** library in your Vue project for a
  more custom approach.

::: note

You can use Empathy Search API, Elasticsearch, or Solr endpoints with both approaches.

:::

##### Developing via Interface X Archetype

The **[Interface&nbsp;X&nbsp;Archetype](https://github.com/empathyco/x-archetype)** project is the
perfect combination of all the existing X&nbsp;Components. It allows you to ramp up quickly with an
already working search and discovery experience, instead of starting from a completely blank canvas.
This is the perfect solution for most cases as you can use it as a springboard to:

- Change the default styles for styles that match your application through design tokens or custom
  CSS.
- Change configuration parameters such as the number of suggestions, enable, or disable instant
  search.
- Change the layout, position, or the number of the components used.
- Use the individual X&nbsp;Component internationalization tool or use your own tool.
- Create new components or modify the existing ones.

To start developing the X&nbsp;Archetype project, see
**[Develop using Interface&nbsp;X&nbsp;Archetype](web-archetype-development-guide.md)**.

##### Developing via Interface X Components library

This is the more deep and flexible use of the
**[Interface&nbsp;X&nbsp;Components library](https://github.com/empathyco/x/tree/main/packages/x-components)**,
allowing you to import any components you desire into your Vue application. It lets you connect,
customize, extend, style, or even create new components without any limitations. This is the way to
go if you like to look under the hood.

- Mix and match with other Vue components.
- Implement in Vue or React projects.
- Extend component behavior with your own development.
- Determine styles using design tokens or custom CSS.

To get started with the X&nbsp;Components library, check out
**[Develop using Interface&nbsp;X&nbsp;Components library](web-x-components-development-guide.md)**.

## Integrating Interface X Archetype

With the **[Interface&nbsp;X&nbsp;Archetype](https://github.com/empathyco/x-archetype)** you have an
isolated search layer up and running in your store web application in a matter of minutes.

To integrate the Interface&nbsp;X&nbsp;Archetype into your project, just **load** the generated
JavaScript file into your website and **initialize** it.

Check out
**[Integrate InterfaceX&nbsp;Archetype into an existing website](web-archetype-integration-guide.md)**,
to integrate the X&nbsp;Archetype project.

## Using and configuring the Interface X Components

To use the Interface&nbsp;X&nbsp;Components, just **import** and **register** the component,
**include** it in your template, and you’re ready to go.

What’s more, each component offers multiple configuration parameters to play around with, giving you
greater flexibility over the experience.

Unsure how to start? Check out
**[How to use and configure Interface&nbsp;X&nbsp;Components in your project](web-how-to-use-x-components-guide.md)**.

<!--
## Style your UI

## Translate your search experience

-->
